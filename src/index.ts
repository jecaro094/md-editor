/**
 * Main entrypoint: the editor and its type surface. Importing from here pulls in
 * CodeMirror, so build tooling that only needs the rendering pipeline must
 * import `@jecaro/md-editor/markdown` instead.
 */
export { mountEditor } from './core/mountEditor.js';
export type {
  Renderer,
  EditorMode,
  EditorOptions,
  EditorBarLink,
  EditorHandle,
} from './types.js';
