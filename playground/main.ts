/**
 * Playground: the editor running standalone, editing real files off your disk.
 *
 * No backend. "Open file…" in the top bar uses the File System Access API
 * (`showOpenFilePicker`) to load a `.md` you pick; "Save" / Mod-S writes back to
 * that same file through the handle the browser granted. The preview renders
 * through `localRenderer()` — the very pipeline `tech-docs` ships — so inline
 * mode looks exactly like `/tech-docs/<slug>/edit` there.
 *
 * Needs a Chromium browser (Chrome / Edge); Firefox and Safari lack the API.
 */
import { localRenderer } from '../src/adapters/local.js';
import { mountEditor, type EditorHandle } from '../src/index.js';

/** `showOpenFilePicker` and the permission methods aren't in every lib.dom yet. */
type OpenFilePicker = (options?: {
  types?: { description?: string; accept: Record<string, string[]> }[];
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
}) => Promise<FileSystemFileHandle[]>;

interface FilePermission {
  queryPermission?(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
  requestPermission?(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

const PLACEHOLDER = `# md-editor playground

Press **Open file…** in the bar to load a \`.md\` from your machine, edit it in
inline mode, and press **Save** (or \`Mod-S\`) to write it straight back to the
same file.

:::tip[Heads up]
This needs a Chromium browser — Chrome or Edge — for the File System Access API.
:::
`;

const host = document.getElementById('app');
if (!host) throw new Error('#app not found');

let handle: FileSystemFileHandle | null = null;
let editor: EditorHandle;

async function openFile(): Promise<void> {
  const picker = (window as unknown as { showOpenFilePicker?: OpenFilePicker }).showOpenFilePicker;
  if (!picker) {
    window.alert('This browser has no File System Access API — use Chrome or Edge.');
    return;
  }

  let picked: FileSystemFileHandle | undefined;
  try {
    [picked] = await picker({
      types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } }],
      multiple: false,
    });
  } catch {
    return; // the user dismissed the picker
  }
  if (!picked) return;

  const text = await (await picked.getFile()).text();
  handle = picked;
  editor.setValue(text);
  editor.markSaved();
  editor.setTitle(picked.name);
}

async function save(content: string): Promise<void> {
  if (!handle) throw new Error('Open a file first (Open file…).');

  const gate = handle as FileSystemFileHandle & FilePermission;
  if (gate.queryPermission && gate.requestPermission) {
    const opts = { mode: 'readwrite' } as const;
    if ((await gate.queryPermission(opts)) !== 'granted') {
      if ((await gate.requestPermission(opts)) !== 'granted') {
        throw new Error('Write permission denied.');
      }
    }
  }

  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

editor = mountEditor(host, {
  value: PLACEHOLDER,
  mode: 'inline',
  // Always open in inline mode; don't let a persisted choice from a past visit win.
  persistModeKey: null,
  title: '(no file)',
  actions: [{ label: 'Open file…', onClick: () => void openFile() }],
  renderer: localRenderer(),
  onSave: save,
  onDirtyChange: (dirty) => console.log('[playground] dirty:', dirty),
});
