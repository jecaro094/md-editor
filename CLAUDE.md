# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run build       # tsup → dist/, then copy src/styles/ → dist/styles/
npm run dev         # tsup --watch, rebuild + re-copy styles on change
npm run typecheck   # tsc --noEmit (the only correctness gate — there are no tests)
npm run playground  # vite playground/ — the editor standalone, editing real files off disk
```

There is no test suite and no lint step. `npm run typecheck` is what CI-equivalent checking looks like here.
`prepare` runs the build, so `npm i github:jecaro094/md-editor#<tag>` builds from source on install.

## What this package is

A Markdown editor built on CodeMirror 6 plus the shared remark/rehype pipeline it renders through.
Extracted from [`tech-docs`](https://github.com/jecaro094/tech-docs); several design choices only make
sense in light of that consumer (see the `theme.css` note below).

## Architecture

### The export map is the architecture

`tsup.config.ts` builds four **independent, non-split** bundles, mirrored in `package.json#exports`:

| Entrypoint | Source | Pulls in CodeMirror? |
|---|---|---|
| `.` (`@jecaro/md-editor`) | `src/index.ts` → `src/core/mountEditor.ts` | yes |
| `./markdown` | `src/markdown/index.ts` | no — DOM-free, CodeMirror-free |
| `./adapters/http` | `src/adapters/http.ts` | no |
| `./adapters/local` | `src/adapters/local.ts` | no (but bundles the remark/rehype/Shiki graph) |

`splitting: false` and `platform: 'neutral'` are deliberate: a consumer's build tooling (e.g.
`astro.config.mjs`) imports `./markdown` to render published pages and **must not** pull the
CodeMirror or DOM graph. Never add an import from `src/markdown/` (or anything it reaches) back to
`src/core/` or `src/inline/`. Styles are not bundled by tsup — `scripts/copy-styles.mjs` copies
`src/styles/*.css` to `dist/styles/` after every build so the `./styles/*.css` subpath exports resolve.

### Styles (`src/styles/`)

Four CSS files, each independently importable via `./styles/<name>.css`:

- `theme.css` — the shared dark theme: colour tokens (`--bg`, `--fg`, `--accent`, `--lime`, …), the
  box-sizing reset, the ~17px base scale, the drifting background blobs, and the `.expressive-code`
  frame (`.code-title-bar`, `.code-lang`, `.copy-btn`) that `rehypeCodeFrame` wraps every fenced block
  in. This is the single source of truth for that chrome — `tech-docs`' `global.css`, `playground/app.css`,
  and `app/src/app.css` used to each carry their own hand-copied version (with comments promising they
  were "kept byte-identical"); they drifted anyway, so all three now `import`/`<link>` this file instead
  and keep only what's genuinely host-specific (font-family tokens, page chrome the editor doesn't own).
  Font tokens (`--font-sans`, `--font-mono`) are deliberately *not* set here since consumers load
  different font stacks — the rules read `var(--font-sans, …)` with a generic fallback and expect a
  host stylesheet loaded after this one to supply the real value.
- `doc.css`, `inline.css`, `editor.css` — as before, scoped to `.doc` / inline-mode decorations / the
  CM6 chrome, reading the same tokens with inline fallbacks so they still work without `theme.css`.

### The rendering pipeline (`src/markdown/index.ts`)

Single source of truth for Markdown → HTML. `renderMarkdown()` and the exported `remarkPlugins` /
`rehypePlugins` arrays are used **both** by the consumer's static build and by the editor's preview,
so the two can never drift. Key custom transforms:

- `remarkAdmonitions` — rewrites `:::note` / `:::info` / `:::tip` / `:::warning` / `:::danger`
  container directives (parsed by `remark-directive`) into `<aside class="admonition …">` with a
  titled header; `:::warning[Custom title]` overrides the label. Order matters: `remark-directive`
  before `remarkAdmonitions`.
- `rehypeCodeFrame` — wraps top-level `<pre>` in a `<figure class="expressive-code">` with a copy
  button. The button is wired by the host page / preview (`wireCopyButtons` in `mountEditor`).
- Shiki (`@shikijs/rehype`, theme `night-owl` via `shikiTheme`) highlights fenced code. It is
  configured with an explicit `shikiLangs` short-list + `lazy: true` + `fallbackLanguage: 'text'`:
  `@shikijs/rehype` otherwise loads *every* bundled grammar (~200 dynamic imports) on the first
  highlight, which in a packaged app (assets over a custom protocol) stalls or fails the first render
  and poisons the singleton highlighter. Common langs load eagerly, the rest on demand, unknown ones
  degrade to a plain block.
- `splitFrontmatter()` — shared YAML-frontmatter splitter; all callers strip frontmatter identically
  before rendering.

`renderMarkdown` dynamically `import()`s unified/remark/rehype/Shiki so `./markdown` stays cheap to
load until something actually renders.

### `mountEditor` (`src/core/mountEditor.ts`)

Framework-agnostic single function — builds all chrome (top bar, panes, toasts) inside a host
element and returns an `EditorHandle`. It absorbs everything the old `tech-docs` `edit.astro`
`<script>` did: CM6 setup, debounced preview, dirty tracking + `beforeunload` guard, toasts, copy
buttons, the mode toggle, the `/` slash menu. The host supplies only `value`, a `renderer`, `onSave`,
and optional top-bar `actions`. **This package never touches disk** — the host owns filesystem access
and any DEV guard.

Three view modes cycled by the top-bar button and persisted to `localStorage` (`persistModeKey`,
default `md-editor:mode`; pass `null` to disable):

- **inline** — block constructs become rendered `.doc` widgets, inline syntax is restyled in place.
  Reconfigured into a `Compartment` (`inlineComp`) on mode change. Needs a `renderer`.
- **split** — editor + preview pane, ~200 ms debounce (`previewDebounceMs`). Needs a `renderer`.
  `initialPreviewHtml` seeds the pane flash-free and defers the first `renderer` call.
- **source** — plain CM6. The forced fallback when no `renderer` is supplied.

`previewSeq` guards against out-of-order async renders (newest keystroke wins).

### Inline mode (`src/inline/`)

`inlineExtensions()` returns only the mode-toggling pieces:

- `syntaxMarks.ts` — synchronous decorations restyling inline syntax, hiding punctuation until the
  caret is on the line.
- `blockField.ts` — async `StateField` swapping block constructs for rendered `.doc` widgets. Renders
  through `renderer.renderBlocks` (one call for N blocks), falling back to N `render` calls; cached by
  exact source text.

Always-on pieces wired by `mountEditor` regardless of mode: `directiveParser.ts` (`:::` Lezer
extension), `slashMenu.ts` (`/` completion source), `commands.ts` (`Mod-B/I/K`, URL-paste-to-link).

### The `Renderer` contract

```ts
interface Renderer {
  render(markdown: string): Promise<string>;
  renderBlocks?(sources: string[]): Promise<string[]>;   // optional batch; inline mode falls back to render()
}
```

Two adapters:

- `./adapters/http` — `remoteRenderer(url)` POSTs `{ content }` → `{ html }` (and `{ blocks }` →
  `{ htmls }`); `httpSave(url, { extra })` POSTs `{ ...extra, content }` → `{ ok: true }`. **`tech-docs`
  uses these** so its editor preview stays byte-identical to its static build and no rendering code
  ships to its browser bundle.
- `./adapters/local` — `localRenderer()` runs the pipeline in the browser. For the playground and
  consumers with no API route. `tech-docs` deliberately does **not** use it.

### Playground (`playground/`)

The editor standalone, no backend, editing real files. `main.ts` uses the File System Access API
(`showOpenFilePicker` / `createWritable`) for open/save — so it needs Chrome or Edge — and renders
through `localRenderer()`. `index.html` links `../src/styles/theme.css` for the shared dark theme
(tokens, ~17px scale, background blobs) so inline mode looks like `/tech-docs/<slug>/edit`; `app.css`
only adds the playground's own font tokens and layout glue. It imports `../src/*.ts` directly (not the
built `dist/`).

### Desktop app (`app/`)

`playground/` promoted to a **Tauri 2** macOS app (see `app/README.md`). Same `mountEditor`, same
`localRenderer()` pipeline, imports `../src/*.ts` directly — only disk access differs: Tauri's
`std::fs` (`src-tauri/src/lib.rs` → `read_file` / `write_file`) instead of the browser API, so it
drops the Chrome/Edge requirement. `src/tauri.ts` wraps `localRenderer()` as `imageAwareRenderer`,
rewriting `<img src>` paths relative to the open `.md` through Tauri's `asset:` protocol
(`convertFileSrc`; `assetProtocol` scope `$HOME/**` + the `protocol-asset` Cargo feature).
`security.csp` is `null`: Tauri appends a `style-src` nonce to any CSP at compile time, and a
nonce makes the browser ignore `'unsafe-inline'`, which blocks the runtime `<style>` tags
CodeMirror 6 / Shiki inject — the CSP is not what gates the asset protocol. Fonts are bundled via
`@fontsource/*` (offline, no Google Fonts CDN). Known gap: a lone `![img](./rel.png)` line renders
through the editor's own no-renderer fast path in `src/inline/blockField.ts`, so `imageAwareRenderer`
can't rewrite it — relative images show broken in inline mode, fine in split. Needs the Rust
toolchain to compile; `npm run typecheck` / `npx vite build` verify the front-end without it.

## Conventions

- ESM only, `type: module`, target ES2022. tsconfig is strict with `noUncheckedIndexedAccess`,
  `verbatimModuleSyntax`, `isolatedModules` — relative imports must carry the `.js` extension.
- Module-level block comments explain *why* a file is shaped the way it is; match that when adding files.
- `EditorBarLink` is a deprecated alias for `EditorBarAction` — use `EditorBarAction`.

## PLAN-EDITOR.md

The original (untracked, Spanish) planning doc for `app/`. Implemented — see "Desktop app (`app/`)"
above. Kept for the rationale behind the CSP / `assetProtocol` / packaging decisions.
