/**
 * Standalone demo. No backend: the preview uses the real rendering pipeline
 * (`../src/markdown`) directly in the browser as a stand-in for the local
 * renderer that Fase E3 will formalise. Save just logs.
 */
import { mountEditor } from '../src/index.js';
import { renderMarkdown, splitFrontmatter } from '../src/markdown/index.js';

const SAMPLE = `---
title: Demo
tagline: Editing @jecaro/md-editor standalone
---

# md-editor

Type on the left, preview on the right. **Bold**, _italic_, \`code\`.

:::tip[Try it]
Type \`:::\` on a new line for admonition snippets.
:::

\`\`\`ts
export const answer = 42;
\`\`\`
`;

const host = document.getElementById('app');
if (!host) throw new Error('#app not found');

mountEditor(host, {
  value: SAMPLE,
  mode: 'split',
  title: 'demo.md',
  renderer: {
    render: async (md) => renderMarkdown(splitFrontmatter(md).body),
  },
  onSave: async (content) => {
    console.log('[demo] save:\n' + content);
  },
  onDirtyChange: (dirty) => console.log('[demo] dirty:', dirty),
});
