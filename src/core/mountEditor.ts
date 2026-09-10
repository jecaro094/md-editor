/**
 * Framework-agnostic mount for the Markdown editor.
 *
 * Everything the old `tech-docs` `edit.astro` `<script>` did lives here now:
 * CodeMirror 6 setup, the debounced live preview, dirty tracking + the
 * `beforeunload` guard, toasts, the copy-button wiring for rendered code
 * frames, the split/source toggle and the `:::` admonition snippets. The host
 * page supplies only `value`, a `renderer`, an `onSave` handler and (optionally)
 * some top-bar links; this function builds the rest of the chrome inside `el`.
 */
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  autocompletion,
  snippetCompletion,
  type CompletionContext,
} from '@codemirror/autocomplete';

import type {
  EditorHandle,
  EditorMode,
  EditorOptions,
} from '../types.js';

const ADMONITION_KINDS = ['note', 'info', 'tip', 'warning', 'danger'] as const;
const DEFAULT_DEBOUNCE = 200;
const DEFAULT_MODE_KEY = 'md-editor:mode';

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

/** A view mode is only meaningfully split vs. source until inline mode lands. */
function normalizeMode(mode: EditorMode | undefined): 'split' | 'source' {
  if (mode === 'source') return 'source';
  if (mode === 'inline') {
    console.warn(
      "[md-editor] mode: 'inline' is not implemented yet — using 'split'.",
    );
  }
  return 'split';
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
  const toggleBtn = el('button', 'mde-toggle', 'Preview');
  toggleBtn.type = 'button';
  toggleBtn.title = 'Toggle the preview pane';
  const saveBtn = el('button', 'mde-save', 'Save');
  saveBtn.type = 'button';
  barActions.append(toggleBtn, saveBtn);

  bar.append(barLeft, barActions);

  const main = el('div', 'mde-main');
  const editorPane = el('div', 'mde-pane mde-editor-pane');
  const previewEl = el('article', 'mde-pane doc mde-preview');
  main.append(editorPane, previewEl);

  root.append(bar, main);
  host.append(root);

  const toastStack = el('div', 'mde-toasts');
  toastStack.setAttribute('aria-live', 'polite');
  document.body.append(toastStack);

  // --- mode --------------------------------------------------------------
  let mode: 'split' | 'source' = normalizeMode(options.mode);
  if (persistModeKey) {
    try {
      const stored = localStorage.getItem(persistModeKey);
      if (stored === 'split' || stored === 'source') mode = stored;
    } catch {
      /* storage disabled — fall back to the option */
    }
  }
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

  // --- live preview, debounced -------------------------------------------
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

  // --- `:::` admonition snippets ---------------------------------------
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
  const extensions: Extension[] = [
    basicSetup,
    keymap.of([
      indentWithTab,
      {
        key: 'Mod-s',
        preventDefault: true,
        run: () => {
          void save();
          return true;
        },
      },
    ]),
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    oneDark,
    EditorView.lineWrapping,
    autocompletion({ override: [admonitionSource] }),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) {
        schedulePreview();
        refreshStatus();
      }
    }),
  ];

  const view = new EditorView({
    parent: editorPane,
    state: EditorState.create({ doc: value, extensions }),
  });

  // --- toggle --------------------------------------------------------
  function applyMode() {
    previewVisible = mode === 'split';
    main.dataset.preview = previewVisible ? 'on' : 'off';
    toggleBtn.setAttribute('aria-pressed', String(previewVisible));
    if (persistModeKey) {
      try {
        localStorage.setItem(persistModeKey, mode);
      } catch {
        /* private mode — toggle still works in-session */
      }
    }
    if (previewVisible) runPreview();
  }
  toggleBtn.addEventListener('click', () => {
    mode = previewVisible ? 'source' : 'split';
    applyMode();
  });
  saveBtn.addEventListener('click', () => void save());

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty()) e.preventDefault();
  };
  window.addEventListener('beforeunload', onBeforeUnload);

  // Initial paint: reflect the (possibly persisted) mode and render once.
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
      mode = normalizeMode(next);
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
