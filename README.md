# @jecaro/md-editor

A split-view Markdown editor built on CodeMirror 6, plus the shared
remark/rehype rendering pipeline it uses. Extracted from
[`tech-docs`](https://github.com/jecaro094/tech-docs); an **inline** (Obsidian
Live Preview–style) mode is the next milestone (see `PLAN.md` in that repo).

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
| `@jecaro/md-editor/styles/editor.css` | editor chrome | — |
| `@jecaro/md-editor/styles/doc.css` | `.doc` prose + admonitions | — |

The `/markdown` split is deliberate: a static-site build can import the pipeline
without shipping the editor to the browser.

## Usage

```ts
import { mountEditor } from '@jecaro/md-editor';
import { remoteRenderer, httpSave } from '@jecaro/md-editor/adapters/http';
import '@jecaro/md-editor/styles/editor.css';
import '@jecaro/md-editor/styles/doc.css';

const editor = mountEditor(document.getElementById('app')!, {
  value: rawMarkdown,           // full .md, frontmatter included
  mode: 'split',                // 'split' | 'source' | 'inline' (inline → split for now)
  title: 'my-doc.md',
  renderer: remoteRenderer('/api/preview'),
  onSave: httpSave('/api/save', { extra: { slug: 'my-doc' } }),
  onDirtyChange: (dirty) => console.log(dirty),
});

// editor.getValue() / setValue() / isDirty() / getMode() / setMode()
// editor.refreshPreview() / markSaved() / destroy()
```

The host page owns filesystem access and the DEV guard; this package never
touches disk.

## Local development against a consumer

```sh
# in md-editor
npm install && npm run build && npm link
# in the consumer
npm link @jecaro/md-editor
```

Run `npm run dev` here for a rebuild-on-change watch. `npm run demo` serves the
standalone demo.

## License

MIT
