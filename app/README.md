# app/ — md-editor desktop (Tauri 2, macOS)

The `playground/` promoted to a real desktop app. Same `mountEditor`, same
`localRenderer()` pipeline (tech-docs' remark/rehype/Shiki graph) — it imports
`../src/*.ts` directly, exactly like the playground. The only difference is disk
access: Tauri's `std::fs` (`src-tauri/src/lib.rs` → `read_file` / `write_file`)
instead of the browser File System Access API, so it no longer needs Chrome/Edge.

**Behaviour:** opens with **Open file…** in the top bar, loads one `.md`, shows
it in inline mode, `⌘S` writes back to the same file. One document at a time.
Relative image paths (`![x](./img/foo.png)`) resolve against the open file's
folder via Tauri's `asset:` protocol (`imageAwareRenderer` in `src/tauri.ts`).

Target: **macOS on Apple Silicon (aarch64)**. Other platforms are out of scope.

---

## 1. Prerequisites (one-time)

### Node

Node ≥ 18 and npm. The repo root already has its `node_modules`; this folder
needs its own.

```sh
cd app
npm install
```

### Rust toolchain

Needed **only to compile** the Tauri shell — the finished `.app` does not require
it. Install non-interactively with `rustup`:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

Then make `cargo` visible in the current shell (new shells pick it up
automatically):

```sh
source "$HOME/.cargo/env"
rustc --version   # sanity check
```

### Xcode Command Line Tools

Required for linking on macOS. `xcode-select -p` should print a path; if not:

```sh
xcode-select --install
```

---

## 2. Scripts

Run all of these from `app/`.

| Script | What it does |
|---|---|
| `npm run dev` | Vite only, on `http://localhost:1420` — the web front-end with **no** Tauri shell. `window.__TAURI__` is absent, so **Open file… / Save do not work**; useful only for pure UI/CSS iteration. |
| `npm run typecheck` | `tsc --noEmit`. The only correctness gate — there are no tests. |
| `npm run tauri:dev` | The real app in a native window with hot-reload. Rust is compiled in **debug** (fast, devtools enabled). This is the normal way to work on it. |
| `npm run tauri:build` | Full **release** build → `.app` + `.dmg` (see §4). Slow: LTO + `codegen-units = 1`. |
| `npm run tauri -- icon <file.png>` | Regenerate `src-tauri/icons/` from a 1024×1024 source PNG. |

---

## 3. Development workflow (`tauri:dev`)

```sh
cd app
source "$HOME/.cargo/env"      # if cargo isn't already on PATH
npm run tauri:dev
```

- First run compiles the whole Tauri crate graph (~2–4 min). Later runs are
  incremental (seconds for a front-end change, ~30–40 s when Rust changes).
- `tauri:dev` starts Vite itself (`beforeDevCommand`) and points the webview at
  `http://localhost:1420`. Editing `src/**` or `../src/**` hot-reloads the
  webview; editing `src-tauri/**` recompiles Rust and relaunches the window.
- Devtools are enabled in this build: **right-click → Inspect Element** for the
  console (CSP violations, render errors, `invoke` failures all show there).
- Stop with `Ctrl-C` in the terminal (or close the window).

The Rust filesystem commands live in `src-tauri/src/lib.rs`; the JS side that
calls them is `src/tauri.ts`; the wiring (`mountEditor`, open/save, close guard)
is `src/main.ts`.

---

## 4. Production build (`tauri:build`)

```sh
cd app
source "$HOME/.cargo/env"
npm run tauri:build
```

Steps it runs:

1. `beforeBuildCommand` → `npm run build` → `tsc --noEmit && vite build` into
   `app/dist/`.
2. `cargo build --release` of `src-tauri` (this is the slow part).
3. Bundles the results.

Artifacts (git-ignored, under `src-tauri/target/release/`):

```
bundle/macos/md-editor.app                     ← the app bundle
bundle/dmg/md-editor_0.1.0_aarch64.dmg         ← drag-to-Applications installer
```

The bundle identifier is `com.jecaro.md-editor` and the version is taken from
`src-tauri/tauri.conf.json` (`version`, currently `0.1.0`).

---

## 5. Run it

### Straight from the build (quickest)

```sh
open "src-tauri/target/release/bundle/macos/md-editor.app"
```

> If a copy is already installed in `/Applications`, `open` may launch **that**
> one instead (same bundle id). Delete the installed copy first, or run the
> binary directly:
> `./src-tauri/target/release/bundle/macos/md-editor.app/Contents/MacOS/md-editor-app`

### From the dev build

`npm run tauri:dev` — see §3.

---

## 6. Install (and re-install)

The build is **unsigned and un-notarised**, and the version string does not
change between builds, so macOS aggressively caches the old copy. Re-installing
cleanly means: quit → delete old → copy new → clear the WebKit cache.

```sh
# 1. quit any running instance
pkill -f "md-editor.app/Contents/MacOS/md-editor-app" 2>/dev/null || true

# 2. remove the previously installed copy (do this BEFORE copying)
rm -rf /Applications/md-editor.app

# 3. install the fresh build
cp -R "src-tauri/target/release/bundle/macos/md-editor.app" /Applications/
#   …or: open src-tauri/target/release/bundle/dmg/md-editor_0.1.0_aarch64.dmg
#        and drag md-editor.app onto the Applications alias.

# 4. clear the WebKit / app caches from the previous version
#    (skip and you can inherit stale styles or a blank window)
rm -rf ~/Library/Caches/com.jecaro.md-editor ~/Library/WebKit/com.jecaro.md-editor

# 5. strip the quarantine flag so Gatekeeper doesn't block the unsigned app
xattr -dr com.apple.quarantine /Applications/md-editor.app

# 6. launch
open /Applications/md-editor.app
```

First launch of an unsigned app can still be refused by Gatekeeper — if so,
**right-click the app → Open → Open** once, then it launches normally afterwards.

To confirm the installed copy is the one you just built:

```sh
shasum /Applications/md-editor.app/Contents/MacOS/md-editor-app \
       src-tauri/target/release/md-editor-app   # hashes should match
```

---

## 7. Using the app

1. **Open file…** in the top bar → pick a `.md`. The window title and the
   top-bar label become the file name.
2. Edit in place. The mode button cycles **inline → split → source**.
3. **⌘S** (or the **Save** button) writes back to the same file; a toast
   confirms. Closing with unsaved changes prompts first.
4. Images written relative to the file (`![x](./img/foo.png)`) load from disk via
   Tauri's `asset:` protocol.

In **inline** mode a block construct — a fenced code block, a table, a `:::`
admonition — is shown as *source* while the caret is inside it, and swapped for
the rendered widget once the caret leaves. So a code block you just typed only
turns into a highlighted frame after you click or arrow away from it; that is by
design, not a bug.

---

## Notes & known issues

- **Unsigned.** macOS Gatekeeper will warn on first launch — right-click → Open.
  Signing/notarisation is out of scope for this version.
- **Icons** in `src-tauri/icons/` are a generated placeholder. Replace with a
  real 1024² PNG and re-run `npm run tauri -- icon <file>`.
- `src-tauri/target/` and `src-tauri/gen/` are git-ignored; `app/dist/` and
  `app/node_modules/` are covered by the repo-root `.gitignore`.
- **`security.csp` is `null`** (Tauri's default), not the value the original plan
  sketched. Tauri appends a `style-src` nonce to any CSP at compile time, and per
  the CSP spec a nonce makes `'unsafe-inline'` be ignored — which blocks the
  `<style>` elements CodeMirror 6 and Shiki inject at runtime, leaving the editor
  unstyled. Relative-image loading does **not** depend on the CSP: it needs only
  `assetProtocol` (enabled, scoped to `$HOME/**`) plus the `protocol-asset` Cargo
  feature. Re-introducing a CSP means giving CodeMirror/Shiki a way to emit the
  Tauri nonce on their injected styles.
- **Inline mode + relative images:** a stand-alone image line (`![x](./a.png)`)
  is turned into a widget by the editor's own fast path, which never calls the
  renderer, so `imageAwareRenderer` cannot rewrite its `src`. Such images resolve
  correctly in **split** and **source→preview**, but show broken in inline mode.
  Fixing it means routing lone images through the renderer in
  `src/inline/blockField.ts` (shared with tech-docs).
- **Shiki grammar loading.** `@shikijs/rehype` defaults to loading *every*
  bundled grammar (~200 dynamic imports) the first time it highlights anything —
  fine over a dev server, but in the packaged app (assets served through a custom
  protocol) it stalled the first code block for seconds and, if one chunk failed,
  poisoned the shared highlighter so no code block ever rendered. `renderMarkdown`
  in `src/markdown/index.ts` now passes an explicit `langs` short-list plus
  `lazy: true` + `fallbackLanguage: 'text'`: common languages load up front,
  anything else on demand, and an unresolvable language degrades to a plain block
  instead of throwing. Vite still emits all the grammar chunks (they are
  statically reachable through `shiki`'s `bundledLanguages` map); only the runtime
  load set shrank.
