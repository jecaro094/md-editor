/**
 * Desktop entrypoint: mounts the editor and wires it to Tauri.
 *
 * This is `playground/main.ts` promoted to a real app. Same `mountEditor`, same
 * `localRenderer()` pipeline; the only difference is that open/save go through
 * Tauri's filesystem (`src/tauri.ts` → Rust `read_file` / `write_file`) instead
 * of the browser File System Access API, so it no longer needs Chrome/Edge.
 *
 * Fonts are bundled locally via `@fontsource/*` (not the Google Fonts CDN) so
 * the app renders correctly offline.
 */
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '../../src/styles/theme.css';
import './app.css';
import '../../src/styles/editor.css';
import '../../src/styles/doc.css';
import '../../src/styles/inline.css';

import { getCurrentWindow } from '@tauri-apps/api/window';
import { confirm } from '@tauri-apps/plugin-dialog';
import { mountEditor, type EditorHandle } from '../../src/index.js';
import { imageAwareRenderer, pickMarkdownFile, writeFile } from './tauri.js';

const PLACEHOLDER = `# md-editor

Press **Open file…** in the bar to load a \`.md\` from your machine, edit it in
inline mode, and press **Save** (or \`Mod-S\`) to write it straight back to the
same file.

:::tip[One file at a time]
This is a single-document editor — opening another \`.md\` replaces the current
one. Relative image paths (\`![x](./img/foo.png)\`) resolve against the open
file's folder.
:::

Fenced code blocks render highlighted once the caret leaves them:

\`\`\`ts
export function open(path: string): Promise<string> {
  return invoke('read_file', { path });
}
\`\`\`
`;

const host = document.getElementById('app');
if (!host) throw new Error('#app not found');

/** The open document — closure state shared by openFile / save / the renderer. */
let currentPath: string | null = null;
let currentDir: string | null = null;
let editor: EditorHandle;

async function openFile(): Promise<void> {
  const file = await pickMarkdownFile();
  if (!file) return; // user cancelled

  currentPath = file.path;
  currentDir = file.dir;
  editor.setValue(file.text);
  editor.markSaved();
  editor.setTitle(file.name);
  editor.refreshPreview(); // pick up the new currentDir for image paths
  await getCurrentWindow().setTitle(file.name);
}

async function save(content: string): Promise<void> {
  if (!currentPath) throw new Error('Open a file first (Open file…).');
  await writeFile(currentPath, content);
  // mountEditor shows the toast and marks the buffer saved.
}

editor = mountEditor(host, {
  value: PLACEHOLDER,
  mode: 'inline',
  // Always open in inline mode; ignore any persisted choice from a past run.
  persistModeKey: null,
  title: '(no file)',
  actions: [{ label: 'Open file…', onClick: () => void openFile() }],
  renderer: imageAwareRenderer(() => currentDir),
  onSave: save,
});

/**
 * Close guard. The editor's own `beforeunload` handler isn't reliable inside a
 * webview, so intercept the window close and confirm through Tauri's dialog.
 *
 * When the handler resolves without `preventDefault()`, `onCloseRequested`
 * finishes the job with `window.destroy()` — which needs the
 * `core:window:allow-destroy` capability. Without it the destroy call rejects
 * and the window silently refuses to close, so that permission is granted in
 * `src-tauri/capabilities/default.json`.
 */
void getCurrentWindow().onCloseRequested(async (event) => {
  if (!editor.isDirty()) return;
  const discard = await confirm('Discard your unsaved changes and close?', {
    title: 'Unsaved changes',
    kind: 'warning',
  });
  if (!discard) event.preventDefault();
});
