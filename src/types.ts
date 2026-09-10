/** Public type surface for `mountEditor`. */

/**
 * Turns a raw `.md` buffer (frontmatter included) into an HTML string. The
 * editor never renders Markdown itself; it delegates here so the preview and
 * the consumer's published pages share one pipeline.
 *
 * Implementations must reject (throw) on failure — `mountEditor` catches and
 * surfaces the message as a toast.
 */
export interface Renderer {
  render(markdown: string): Promise<string>;
}

export type EditorMode = 'inline' | 'split' | 'source';

export interface EditorOptions {
  /** The complete `.md` document, frontmatter included. */
  value: string;
  /**
   * Initial view mode. `'split'` = editor + live preview, `'source'` = editor
   * only. `'inline'` is reserved for the upcoming live-preview mode and falls
   * back to `'split'` until it lands.
   */
  mode?: EditorMode;
  /** Renders the preview pane. Required for `'split'` / `'inline'`. */
  renderer?: Renderer;
  /** Persisted on `Mod-S` and the Save button. Throw to signal failure. */
  onSave?: (content: string) => Promise<void> | void;
  /** Fires whenever the dirty flag flips. */
  onDirtyChange?: (dirty: boolean) => void;
  /** Debounce before re-rendering the preview after a keystroke. Default 200 ms. */
  previewDebounceMs?: number;
  /** Shown in the top bar (e.g. the file name). */
  title?: string;
  /** Extra links rendered on the left of the top bar (e.g. "← Back", "View ↗"). */
  actions?: EditorBarLink[];
  /**
   * Key under which the mode toggle is remembered in `localStorage`. Pass
   * `null` to disable persistence. Default `'md-editor:mode'`.
   */
  persistModeKey?: string | null;
}

export interface EditorBarLink {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface EditorHandle {
  getValue(): string;
  setValue(next: string): void;
  isDirty(): boolean;
  getMode(): EditorMode;
  setMode(mode: EditorMode): void;
  /** Force a preview re-render now (no-op in `'source'` mode). */
  refreshPreview(): void;
  /** Mark the current buffer as the saved baseline without calling `onSave`. */
  markSaved(): void;
  destroy(): void;
}
