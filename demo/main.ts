/**
 * Standalone demo. No backend: the preview renders through `localRenderer()`,
 * the same remark/rehype pipeline the package ships, running in the browser.
 * Save just logs. Opens in inline mode; the top-bar button cycles
 * inline → split → source.
 */
import { mountEditor } from '../src/index.js';
import { localRenderer } from '../src/adapters/local.js';

const SAMPLE = `---
title: Demo
tagline: Editing @jecaro/md-editor standalone
---

# md-editor

Type in the editor. **Bold**, _italic_, \`code\`, ~~strike~~ and
[links](https://example.com) render in place; move the caret onto a line to see
its raw Markdown.

:::tip[Try it]
Type \`/\` on a new line for the slash menu.
:::

\`\`\`ts
export const answer = 42;
\`\`\`

| Lang | Year |
| --- | --- |
| TS | 2012 |
`;

const host = document.getElementById('app');
if (!host) throw new Error('#app not found');

mountEditor(host, {
  value: SAMPLE,
  mode: 'inline',
  title: 'demo.md',
  renderer: localRenderer(),
  onSave: async (content) => {
    console.log('[demo] save:\n' + content);
  },
  onDirtyChange: (dirty) => console.log('[demo] dirty:', dirty),
});
