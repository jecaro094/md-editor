/**
 * Tauri glue for the desktop editor. Everything that touches the OS lives here:
 * the open dialog, the Rust `read_file` / `write_file` commands, and the
 * renderer wrapper that resolves image paths relative to the open `.md`.
 *
 * The front-end is otherwise the playground verbatim — same `mountEditor`, same
 * `localRenderer()` pipeline (tech-docs' remark/rehype/Shiki graph). Only the
 * disk access differs: Tauri's `std::fs` instead of the browser File System
 * Access API, so the app is no longer tied to Chrome/Edge.
 */
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { localRenderer } from '../../src/adapters/local.js';
import type { Renderer } from '../../src/index.js';

export interface OpenedFile {
  /** Absolute path as the OS reported it — passed back to `write_file` as-is. */
  path: string;
  /** Basename, for the top-bar label and the window title. */
  name: string;
  /** Directory holding the file — the base for resolving relative `<img src>`. */
  dir: string;
  text: string;
}

/** Show the open dialog, read the picked `.md`. `null` if the user cancels. */
export async function pickMarkdownFile(): Promise<OpenedFile | null> {
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
  });
  if (typeof selected !== 'string') return null;

  const text = await invoke<string>('read_file', { path: selected });
  const norm = selected.replace(/\\/g, '/');
  const slash = norm.lastIndexOf('/');
  return {
    path: selected,
    name: slash >= 0 ? norm.slice(slash + 1) : norm,
    dir: slash >= 0 ? selected.slice(0, slash) : '.',
    text,
  };
}

/** Write `content` back to `path` through the Rust `write_file` command. */
export function writeFile(path: string, content: string): Promise<void> {
  return invoke('write_file', { path, content });
}

/**
 * Wraps `localRenderer()` so that an `<img src>` pointing at a path relative to
 * the open `.md` (`./img/foo.png`, `../assets/x.png`) is resolved against the
 * file's directory and rewritten through Tauri's `convertFileSrc` (the `asset:`
 * protocol, allowed for `$HOME/**` in `tauri.conf.json`). Absolute URLs, root-
 * relative paths, `data:` URIs and fragments are left untouched.
 *
 * `getDir` is read fresh on every render, so the returned `Renderer` keeps a
 * stable identity across `openFile()` calls — `mountEditor` holds onto it.
 */
export function imageAwareRenderer(getDir: () => string | null): Renderer {
  const base = localRenderer();

  const rewrite = (html: string): string => {
    const dir = getDir();
    if (!dir) return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let touched = false;
    for (const img of Array.from(doc.querySelectorAll('img'))) {
      const src = img.getAttribute('src');
      if (!src || isAbsoluteRef(src)) continue;
      img.setAttribute('src', convertFileSrc(joinPath(dir, src)));
      touched = true;
    }
    return touched ? doc.body.innerHTML : html;
  };

  const batch = base.renderBlocks;
  return {
    render: async (md) => rewrite(await base.render(md)),
    ...(batch
      ? { renderBlocks: async (sources) => (await batch(sources)).map(rewrite) }
      : {}),
  };
}

/** True for anything we must not treat as a path relative to the `.md`. */
function isAbsoluteRef(src: string): boolean {
  return (
    /^[a-z][a-z0-9+.-]*:/i.test(src) || // scheme: http: https: data: asset: mailto:
    src.startsWith('//') ||
    src.startsWith('/') ||
    src.startsWith('#')
  );
}

/** POSIX-style join + `.`/`..` normalisation; keeps a leading `/` if present. */
function joinPath(dir: string, rel: string): string {
  const absolute = dir.startsWith('/');
  const out: string[] = [];
  for (const part of `${dir}/${rel}`.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') out.pop();
    else out.push(part);
  }
  return (absolute ? '/' : '') + out.join('/');
}
