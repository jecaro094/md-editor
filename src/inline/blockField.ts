/**
 * Asynchronous half of inline mode: block-level constructs — fenced code,
 * tables, `:::` admonitions, thematic breaks and stand-alone images — are
 * replaced by a rendered widget carrying the same `.doc` HTML the published page
 * would show. Fenced code / tables / admonitions go through the `Renderer`
 * (batched, cached by exact source text); rules and images are rendered inline
 * with no round-trip.
 *
 * This lives in a `StateField`, not a view plugin: CodeMirror only accepts
 * `block: true` decorations from a field-backed `EditorView.decorations`
 * provider. A companion view plugin drives the async renders and asks the field
 * to rebuild when their HTML arrives.
 *
 * A pointer press on a widget drops the caret into the source it stands for; the
 * next rebuild then shows raw Markdown for that block so it can be edited.
 */
import { syntaxTree } from '@codemirror/language';
import {
  type Range,
  StateEffect,
  StateField,
} from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import type { Renderer } from '../types.js';

const ASYNC_BLOCKS = new Set(['FencedCode', 'Table', 'Directive']);
const LONE_IMAGE = /^!\[[^\]]*\]\([^\s)]+\)$/;
const RENDER_DEBOUNCE = 120;

interface BlockSpec {
  /** Start of the first line the block occupies. */
  from: number;
  /** End of the last line the block occupies. */
  to: number;
  /** Exact source text of the construct — the cache key and render input. */
  key: string;
  /** The selection is inside the block: show source, not a widget. */
  active: boolean;
  kind: 'async' | 'rule' | 'image';
}

/** One pass over the syntax tree collecting every widget-eligible block. */
function scan(state: EditorView['state']): BlockSpec[] {
  const specs: BlockSpec[] = [];
  const sel = state.selection.ranges;
  syntaxTree(state).iterate({
    enter: (node) => {
      let kind: BlockSpec['kind'] | null = null;
      if (ASYNC_BLOCKS.has(node.name)) {
        kind = 'async';
      } else if (node.name === 'HorizontalRule') {
        kind = 'rule';
      } else if (node.name === 'Paragraph') {
        if (LONE_IMAGE.test(state.doc.sliceString(node.from, node.to).trim())) kind = 'image';
        else return undefined;
      } else {
        return undefined;
      }

      const from = state.doc.lineAt(node.from).from;
      const to = state.doc.lineAt(node.to).to;
      const active = sel.some((r) => r.from <= to && r.to >= from);
      specs.push({ from, to, key: state.doc.sliceString(node.from, node.to).trim(), active, kind });
      return false;
    },
  });
  return specs;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** `![alt](src)` → an `<img>` tag, without a pipeline round-trip. */
function imageHtml(source: string): string {
  const m = /^!\[([^\]]*)\]\(([^\s)]+)\)$/.exec(source);
  if (!m) return escapeAttr(source);
  return `<img src="${escapeAttr(m[2] ?? '')}" alt="${escapeAttr(m[1] ?? '')}" />`;
}

class BlockWidget extends WidgetType {
  constructor(
    readonly key: string,
    readonly html: string,
    readonly wire?: (scope: ParentNode) => void,
  ) {
    super();
  }
  override eq(other: BlockWidget) {
    return other.key === this.key && other.html === this.html;
  }
  toDOM(view: EditorView) {
    const wrap = document.createElement('div');
    wrap.className = 'mde-inline-block doc';
    wrap.innerHTML = this.html;
    this.wire?.(wrap);
    wrap.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const pos = view.posAtDOM(wrap);
      view.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
      view.focus();
    });
    return wrap;
  }
  override ignoreEvent() {
    return false;
  }
}

const rebuildBlocks = StateEffect.define<void>();

export interface BlockWidgetsOptions {
  renderer: Renderer;
  /** Re-used from `mountEditor` so rendered code frames get working copy buttons. */
  wireCopyButtons?: (scope: ParentNode) => void;
}

export function blockWidgets(options: BlockWidgetsOptions) {
  const { renderer, wireCopyButtons } = options;
  const cache = new Map<string, string>();
  const inFlight = new Set<string>();

  const blockReplace = (widget: WidgetType) => Decoration.replace({ widget, block: true });

  function build(state: EditorView['state']): DecorationSet {
    const ranges: Range<Decoration>[] = [];
    for (const spec of scan(state)) {
      if (spec.active) continue;
      if (spec.kind === 'rule') {
        ranges.push(blockReplace(new BlockWidget(spec.key, '<hr />')).range(spec.from, spec.to));
      } else if (spec.kind === 'image') {
        ranges.push(
          blockReplace(new BlockWidget(spec.key, imageHtml(spec.key))).range(spec.from, spec.to),
        );
      } else {
        const html = cache.get(spec.key);
        if (html != null) {
          ranges.push(
            blockReplace(new BlockWidget(spec.key, html, wireCopyButtons)).range(spec.from, spec.to),
          );
        }
      }
    }
    return Decoration.set(ranges, true);
  }

  const field = StateField.define<DecorationSet>({
    create: (state) => build(state),
    update: (value, tr) => {
      if (tr.docChanged || tr.selection || tr.effects.some((e) => e.is(rebuildBlocks))) {
        return build(tr.state);
      }
      return value;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  const driver = ViewPlugin.fromClass(
    class {
      timer: number | undefined;
      constructor(view: EditorView) {
        this.schedule(view);
      }
      update(u: ViewUpdate) {
        if (u.docChanged || u.selectionSet) this.schedule(u.view);
      }
      schedule(view: EditorView) {
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => void this.run(view), RENDER_DEBOUNCE);
      }
      async run(view: EditorView) {
        const pending: string[] = [];
        for (const spec of scan(view.state)) {
          if (
            spec.kind === 'async' &&
            !spec.active &&
            !cache.has(spec.key) &&
            !inFlight.has(spec.key)
          ) {
            pending.push(spec.key);
          }
        }
        if (!pending.length) return;
        pending.forEach((k) => inFlight.add(k));
        try {
          const htmls = renderer.renderBlocks
            ? await renderer.renderBlocks(pending)
            : await Promise.all(pending.map((k) => renderer.render(k)));
          pending.forEach((k, i) => {
            if (typeof htmls[i] === 'string') cache.set(k, htmls[i] as string);
          });
        } catch {
          // Leave the source visible; the next keystroke or toggle retries.
        } finally {
          pending.forEach((k) => inFlight.delete(k));
          view.dispatch({ effects: rebuildBlocks.of() });
        }
      }
      destroy() {
        window.clearTimeout(this.timer);
      }
    },
  );

  return [field, driver];
}
