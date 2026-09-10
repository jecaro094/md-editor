/**
 * Synchronous half of inline mode: mark decorations that restyle inline syntax
 * (headings, bold, italic, code, links, strikethrough, blockquote) and replace
 * decorations that hide the punctuation marks — `#`, `**`, `` ` ``, `[` `]` `(url)` —
 * unless the selection is on that line, in which case the raw source is shown so
 * it can be edited. This is the "cursor inside → source, cursor outside →
 * rendered" rule from Obsidian's Live Preview.
 *
 * Block-level constructs (fenced code, tables, admonitions, rules, lone images)
 * are handled by `blockField.ts`, which must be a `StateField` because CodeMirror
 * forbids `block: true` decorations from a view plugin.
 */
import { syntaxTree } from '@codemirror/language';
import type { Range } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view';

const HIDE = Decoration.replace({});

const MARK: Record<string, Decoration> = {
  ATXHeading1: Decoration.mark({ class: 'cm-md-heading cm-md-h1' }),
  ATXHeading2: Decoration.mark({ class: 'cm-md-heading cm-md-h2' }),
  ATXHeading3: Decoration.mark({ class: 'cm-md-heading cm-md-h3' }),
  ATXHeading4: Decoration.mark({ class: 'cm-md-heading cm-md-h4' }),
  ATXHeading5: Decoration.mark({ class: 'cm-md-heading cm-md-h5' }),
  ATXHeading6: Decoration.mark({ class: 'cm-md-heading cm-md-h6' }),
  StrongEmphasis: Decoration.mark({ class: 'cm-md-strong' }),
  Emphasis: Decoration.mark({ class: 'cm-md-em' }),
  InlineCode: Decoration.mark({ class: 'cm-md-code' }),
  Strikethrough: Decoration.mark({ class: 'cm-md-strike' }),
  Link: Decoration.mark({ class: 'cm-md-link' }),
};

/** Marker child nodes whose text is punctuation we hide when the line is idle. */
const MARK_TOKENS = new Set([
  'HeaderMark',
  'EmphasisMark',
  'CodeMark',
  'StrikethroughMark',
  'LinkMark',
  'URL',
  'QuoteMark',
]);

function buildMarks(view: EditorView): DecorationSet {
  const { state } = view;
  const sel = state.selection.ranges;
  const lineActive = (pos: number): boolean => {
    const line = state.doc.lineAt(pos);
    return sel.some((r) => r.from <= line.to && r.to >= line.from);
  };

  const ranges: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        // Never touch the inside of a block widget's construct.
        if (node.name === 'FencedCode' || node.name === 'Table' || node.name === 'Directive') {
          return false;
        }

        const mark = MARK[node.name];
        if (mark && node.to > node.from) {
          ranges.push(mark.range(node.from, node.to));
        }

        if (MARK_TOKENS.has(node.name) && node.to > node.from && !lineActive(node.from)) {
          // Keep one trailing space after a `#…` so the heading text doesn't
          // butt against the left edge when the marks collapse.
          const end =
            node.name === 'HeaderMark' && state.doc.sliceString(node.to, node.to + 1) === ' '
              ? node.to + 1
              : node.to;
          ranges.push(HIDE.range(node.from, end));
        }
        return undefined;
      },
    });
  }
  return Decoration.set(ranges, true);
}

export const inlineSyntaxMarks = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildMarks(view);
    }
    update(u: ViewUpdate) {
      if (u.docChanged || u.viewportChanged || u.selectionSet) {
        this.decorations = buildMarks(u.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
