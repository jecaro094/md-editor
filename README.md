# @jecaro/md-editor

A Markdown editor built on CodeMirror 6 with three view modes — **inline** live
preview (Obsidian-style), a classic **split** view, and plain **source** — plus
the shared remark/rehype rendering pipeline it uses. Extracted from
[`tech-docs`](https://github.com/jecaro094/tech-docs).

## Install

```sh
npm i github:jecaro094/md-editor#v0.1.0
```

CodeMirror and the remark/rehype stack are regular dependencies — you install
one thing.

## Entrypoints

| Import | Contents | Pulls CodeMirror? |
|---|---|---|
| `@jecaro/md-editor` | `mountEditor`, types | yes |
| `@jecaro/md-editor/markdown` | `renderMarkdown`, `splitFrontmatter`, `remarkPlugins`, `rehypePlugins`, `shikiTheme`, … | no |
| `@jecaro/md-editor/adapters/http` | `remoteRenderer`, `httpSave` | no |
| `@jecaro/md-editor/adapters/local` | `localRenderer` (runs the pipeline in the browser) | no (but bundles remark/rehype) |
| `@jecaro/md-editor/styles/editor.css` | editor chrome | — |
| `@jecaro/md-editor/styles/doc.css` | `.doc` prose + admonitions | — |
| `@jecaro/md-editor/styles/inline.css` | inline-mode syntax marks + block widgets | — |

The `/markdown` split is deliberate: a static-site build can import the pipeline
without shipping the editor to the browser.

## Usage

```ts
import { mountEditor } from '@jecaro/md-editor';
import { remoteRenderer, httpSave } from '@jecaro/md-editor/adapters/http';
import '@jecaro/md-editor/styles/editor.css';
import '@jecaro/md-editor/styles/doc.css';
import '@jecaro/md-editor/styles/inline.css';

const editor = mountEditor(document.getElementById('app')!, {
  value: rawMarkdown,           // full .md, frontmatter included
  mode: 'inline',               // 'inline' | 'split' | 'source'
  title: 'my-doc.md',
  renderer: remoteRenderer('/api/preview'),
  onSave: httpSave('/api/save', { extra: { slug: 'my-doc' } }),
  onDirtyChange: (dirty) => console.log(dirty),
});

// editor.getValue() / setValue() / isDirty() / getMode() / setMode()
// editor.refreshPreview() / markSaved() / destroy()
```

The top-bar button cycles the three modes and remembers the choice in
`localStorage` (`persistModeKey`, default `md-editor:mode`).

### Modes

- **inline** — block constructs (fenced code, tables, `:::` admonitions,
  thematic breaks, stand-alone images) are swapped for a rendered `.doc` widget;
  inline syntax (headings, bold, italic, code, links, strikethrough) is restyled
  in place and its punctuation hides until the caret is on the line. Block
  widgets render through `renderer.renderBlocks` (falling back to N `render`
  calls), cached by exact source text.
- **split** — editor left, a `renderer.render` preview pane right, ~200 ms
  debounce.
- **source** — no preview.

`inline` and `split` need a `renderer`; without one the editor forces `source`.

### Always-on editing aids

Independent of mode: a `/` slash menu at the start of a line (headings, lists,
quote, fence, table, the five admonitions), `Mod-B` / `Mod-I` / `Mod-K` around
the selection, pasting a URL over a selection to make a link, and `:::`
admonition completions.

The host page owns filesystem access and the DEV guard; this package never
touches disk.

## The `Renderer` contract

```ts
interface Renderer {
  render(markdown: string): Promise<string>;
  renderBlocks?(sources: string[]): Promise<string[]>;
}
```

`remoteRenderer` implements both: `render` POSTs `{ content }` and expects
`{ html }`; `renderBlocks` POSTs `{ blocks: string[] }` and expects
`{ htmls: string[] }`. A backend that only handles `{ content }` still works —
inline mode falls back to one `render` call per block.

## Local development against a consumer

```sh
# in md-editor
npm install && npm run build && npm link
# in the consumer
npm link @jecaro/md-editor
```

Run `npm run dev` here for a rebuild-on-change watch. `npm run demo` serves the
standalone demo (inline mode, `localRenderer`).

## License

MIT
