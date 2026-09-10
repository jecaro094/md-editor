/**
 * Editor-wide Markdown shortcuts, available in every mode:
 *   Mod-B / Mod-I  wrap the selection in `**` / `*`
 *   Mod-K          wrap the selection in a link, caret in the URL slot
 *   paste a URL over a selection → `[selection](pasted-url)`
 */
import { EditorSelection } from '@codemirror/state';
import { EditorView, type KeyBinding } from '@codemirror/view';

function wrap(view: EditorView, token: string): boolean {
  const { state } = view;
  if (state.selection.ranges.every((r) => r.empty)) return false;
  view.dispatch(
    state.changeByRange((range) => ({
      changes: [
        { from: range.from, insert: token },
        { from: range.to, insert: token },
      ],
      range: EditorSelection.range(range.from + token.length, range.to + token.length),
    })),
  );
  return true;
}

function linkify(view: EditorView, url: string): boolean {
  const { state } = view;
  if (state.selection.ranges.every((r) => r.empty)) return false;
  view.dispatch(
    state.changeByRange((range) => {
      const tail = `](${url})`;
      const urlStart = range.to + 1 + 2; // past the inserted "[" and "]("
      return {
        changes: [
          { from: range.from, insert: '[' },
          { from: range.to, insert: tail },
        ],
        range: EditorSelection.range(urlStart, urlStart + url.length),
      };
    }),
  );
  return true;
}

export const markdownShortcuts: KeyBinding[] = [
  { key: 'Mod-b', preventDefault: true, run: (v) => wrap(v, '**') },
  { key: 'Mod-i', preventDefault: true, run: (v) => wrap(v, '*') },
  { key: 'Mod-k', preventDefault: true, run: (v) => linkify(v, 'url') },
];

const URL_ONLY = /^https?:\/\/\S+$/;

export const pasteLink = EditorView.domEventHandlers({
  paste(event, view) {
    const text = event.clipboardData?.getData('text/plain')?.trim();
    if (!text || !URL_ONLY.test(text)) return false;
    if (view.state.selection.ranges.every((r) => r.empty)) return false;
    event.preventDefault();
    view.dispatch(
      view.state.changeByRange((range) => {
        const tail = `](${text})`;
        return {
          changes: [
            { from: range.from, insert: '[' },
            { from: range.to, insert: tail },
          ],
          range: EditorSelection.cursor(range.to + 1 + tail.length),
        };
      }),
    );
    return true;
  },
});
