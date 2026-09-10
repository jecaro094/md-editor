/**
 * Framework-agnostic mount for the Markdown editor.
 *
 * Everything the old `tech-docs` `edit.astro` `<script>` did lives here now:
 * CodeMirror 6 setup, the debounced live preview, dirty tracking + the
 * `beforeunload` guard, toasts, the copy-button wiring for rendered code
 * frames, the view-mode toggle and the `/` snippet menu. The host page supplies
 * only `value`, a `renderer`, an `onSave` handler and (optionally) some top-bar
 * links; this function builds the rest of the chrome inside `el`.
 *
 * Three view modes, cycled by the top-bar button and persisted to
 * `localStorage`:
 *   - `inline`  live preview in the editor itself (block widgets + revealed syntax)
 *   - `split`   editor left, a server-rendered `.doc` preview pane right
 *   - `source`  plain CodeMirror, no preview
 */
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  autocompletion,
  snippetCompletion,
  type CompletionContext,
} from '@codemirror/autocomplete';

import {
  containerDirective,
  inlineExtensions,
  markdownShortcuts,
  pasteLink,
  slashSource,
} from '../inline/index.js';
import type {
  EditorHandle,
  EditorMode,
  EditorOptions,
} from '../types.js';

const ADMONITION_KINDS = ['note', 'info', 'tip', 'warning', 'danger'] as const;
const DEFAULT_DEBOUNCE = 200;
const DEFAULT_MODE_KEY = 'md-editor:mode';

type ViewMode = 'inline' | 'split' | 'source';
const MODE_LABEL: Record<ViewMode, string> = {
  inline: 'Inline',
  split: 'Split',
  source: 'Source',
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function normalizeMode(mode: EditorMode | undefined): ViewMode {
  return mode === 'inline' || mode === 'source' ? mode : 'split';
}

export function mountEditor(
  host: HTMLElement,
  options: EditorOptions,
): EditorHandle {
  const {
    value,
    renderer,
    onSave,
    onDirtyChange,
    initialPreviewHtml,
    previewDebounceMs = DEFAULT_DEBOUNCE,
    title,
    actions = [],
    persistModeKey = DEFAULT_MODE_KEY,
  } = options;

  // --- chrome ---------------------------------------------------------------
  const root = el('div', 'mde');

  const bar = el('header', 'mde-bar');
  const barLeft = el('div', 'mde-bar-left');
  for (const link of actions) {
    const a = el('a', 'mde-bar-link', link.label);
    a.href = link.href;
    if (link.newTab) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    barLeft.append(a);
  }
  if (title) barLeft.append(el('span', 'mde-title', title));
  const statusEl = el('span', 'mde-status', 'Saved');
  statusEl.dataset.dirty = 'false';
  barLeft.append(statusEl);

  const barActions = el('div', 'mde-bar-actions');
  const toggleBtn = el('button', 'mde-toggle', 'Split');
  toggleBtn.type = 'button';
  toggleBtn.title = 'Switch view mode (inline / split / source)';
  const saveBtn = el('button', 'mde-save', 'Save');
  saveBtn.type = 'button';
  barActions.append(toggleBtn, saveBtn);

  bar.append(barLeft, barActions);

  const main = el('div', 'mde-main');
  const editorPane = el('div', 'mde-pane mde-editor-pane');
  const previewEl = el('article', 'mde-pane doc mde-preview');
  main.append(editorPane, previewEl);

  let previewSeeded = false;
  if (initialPreviewHtml != null) {
    previewEl.innerHTML = initialPreviewHtml;
    previewSeeded = true;
  }

  root.append(bar, main);
  host.append(root);

  const toastStack = el('div', 'mde-toasts');
  toastStack.setAttribute('aria-live', 'polite');
  document.body.append(toastStack);

  // --- mode --------------------------------------------------------------
  let mode: ViewMode = normalizeMode(options.mode);
  if (persistModeKey) {
    try {
      const stored = localStorage.getItem(persistModeKey);
      if (stored === 'inline' || stored === 'split' || stored === 'source') mode = stored;
    } catch {
      /* storage disabled — fall back to the option */
    }
  }
  // `inline` and `split` both need a renderer; without one, only source is real.
  if (!renderer && mode !== 'source') {
    console.warn('[md-editor] no renderer supplied — falling back to source mode.');
    mode = 'source';
  }
  const modeOrder: ViewMode[] = renderer ? ['inline', 'split', 'source'] : ['source'];
  if (modeOrder.length === 1) toggleBtn.disabled = true;
  let previewVisible = mode === 'split';

  // --- toasts ----------------------------------------------------------------
  const timers = new Set<number>();
  function toast(message: string, kind: 'ok' | 'danger' = 'ok') {
    const node = el('div', `mde-toast mde-toast-${kind}`, message);
    toastStack.append(node);
    const id = window.setTimeout(
      () => {
        node.remove();
        timers.delete(id);
      },
      kind === 'danger' ? 6000 : 3000,
    );
    timers.add(id);
  }

  // --- copy buttons on rendered code frames --------------------------------
  function wireCopyButtons(scope: ParentNode) {
    scope.querySelectorAll<HTMLElement>('.expressive-code').forEach((frame) => {
      const btn = frame.querySelector<HTMLButtonElement>('.copy-btn');
      const pre = frame.querySelector('pre');
      if (!btn || !pre || btn.dataset.wired) return;
      btn.dataset.wired = 'true';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = '✓';
          btn.classList.add('copied');
        } catch {
          btn.textContent = '✕';
        }
        window.setTimeout(() => {
          btn.textContent = '⧉';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // --- dirty tracking ----------------------------------------------------
  let savedText = value;
  const isDirty = () => view.state.doc.toString() !== savedText;
  function refreshStatus() {
    const dirty = isDirty();
    statusEl.dataset.dirty = String(dirty);
    statusEl.textContent = dirty ? 'Unsaved' : 'Saved';
    onDirtyChange?.(dirty);
  }

  // --- live preview, debounced (split mode) -----------------------------
  let previewTimer: number | undefined;
  let previewSeq = 0;
  function schedulePreview() {
    if (!previewVisible) return;
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(runPreview, previewDebounceMs);
  }
  async function runPreview() {
    if (!renderer) return;
    const seq = ++previewSeq;
    try {
      const html = await renderer.render(view.state.doc.toString());
      if (seq !== previewSeq) return; // a newer keystroke already won
      previewEl.innerHTML = html;
      wireCopyButtons(previewEl);
    } catch (err) {
      if (seq === previewSeq) {
        toast((err as Error).message || 'Preview failed', 'danger');
      }
    }
  }

  // --- save -------------------------------------------------------------
  async function save() {
    if (!isDirty() || !onSave) return;
    saveBtn.disabled = true;
    const snapshot = view.state.doc.toString();
    try {
      await onSave(snapshot);
      savedText = snapshot;
      refreshStatus();
      toast('Saved');
    } catch (err) {
      toast((err as Error).message || 'Save failed', 'danger');
    } finally {
      saveBtn.disabled = false;
    }
  }

  // --- `:::` admonition snippets (kept alongside the `/` menu) ----------
  function admonitionSource(context: CompletionContext) {
    const token = context.matchBefore(/:{1,3}\w*/);
    if (!token || (token.from === token.to && !context.explicit)) return null;
    return {
      from: token.from,
      options: ADMONITION_KINDS.map((k) =>
        snippetCompletion(`:::${k}\n\${}\n:::\n`, {
          label: `:::${k}`,
          type: 'keyword',
          detail: 'admonition',
        }),
      ),
    };
  }

  // --- editor ----------------------------------------------------------
  const inlineComp = new Compartment();

  const extensions: Extension[] = [
    basicSetup,
    keymap.of([
      indentWithTab,
      ...markdownShortcuts,
      {
        key: 'Mod-s',
        preventDefault: true,
        run: () => {
          void save();
          return true;
        },
      },
    ]),
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      extensions: [containerDirective],
    }),
    oneDark,
    EditorView.lineWrapping,
    autocompletion({ override: [slashSource, admonitionSource] }),
    pasteLink,
    inlineComp.of([]),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) {
        previewSeeded = false; // the seed no longer reflects the buffer
        schedulePreview();
        refreshStatus();
      }
    }),
  ];

  const view = new EditorView({
    parent: editorPane,
    state: EditorState.create({ doc: value, extensions }),
  });

  // --- mode application --------------------------------------------------
  function inlineExt(): Extension {
    return renderer ? inlineExtensions({ renderer, wireCopyButtons }) : [];
  }
  function applyMode() {
    previewVisible = mode === 'split';
    main.dataset.mode = mode;
    main.dataset.preview = previewVisible ? 'on' : 'off';
    toggleBtn.textContent = MODE_LABEL[mode];
    toggleBtn.setAttribute('aria-pressed', String(mode === 'inline'));
    view.dispatch({
      effects: inlineComp.reconfigure(mode === 'inline' ? inlineExt() : []),
    });
    if (persistModeKey) {
      try {
        localStorage.setItem(persistModeKey, mode);
      } catch {
        /* private mode — toggle still works in-session */
      }
    }
    if (previewVisible) {
      // A server-seeded pane is already current — skip the redundant first
      // render, then behave normally on every subsequent call.
      if (previewSeeded) previewSeeded = false;
      else runPreview();
    }
  }
  toggleBtn.addEventListener('click', () => {
    const i = modeOrder.indexOf(mode);
    mode = modeOrder[(i + 1) % modeOrder.length] ?? 'source';
    applyMode();
  });
  saveBtn.addEventListener('click', () => void save());

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty()) e.preventDefault();
  };
  window.addEventListener('beforeunload', onBeforeUnload);

  // Initial paint: reflect the (possibly persisted) mode and render once.
  if (previewSeeded) wireCopyButtons(previewEl);
  applyMode();

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (next: string) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
      });
      refreshStatus();
    },
    isDirty,
    getMode: () => mode,
    setMode: (next: EditorMode) => {
      const wanted = normalizeMode(next);
      mode = modeOrder.includes(wanted) ? wanted : mode;
      applyMode();
    },
    refreshPreview: () => {
      if (previewVisible) runPreview();
    },
    markSaved: () => {
      savedText = view.state.doc.toString();
      refreshStatus();
    },
    destroy: () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.clearTimeout(previewTimer);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      view.destroy();
      root.remove();
      toastStack.remove();
    },
  };
}
