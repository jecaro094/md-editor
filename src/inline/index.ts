/**
 * Inline live-preview mode — the CodeMirror extension bundle behind
 * `mountEditor({ mode: 'inline' })`.
 *
 * `inlineExtensions()` returns only the pieces that toggle with the mode: the
 * synchronous syntax-mark decorations and the async block-widget field. The
 * always-on pieces (the `:::` parser, the `/` menu, `Mod-B/I/K`, URL paste) are
 * wired once by `mountEditor` regardless of mode.
 */
import { EditorView } from '@codemirror/view';

import { blockWidgets, type BlockWidgetsOptions } from './blockField.js';
import { inlineSyntaxMarks } from './syntaxMarks.js';

export { containerDirective } from './directiveParser.js';
export { slashSource } from './slashMenu.js';
export { markdownShortcuts, pasteLink } from './commands.js';

export type InlineModeOptions = BlockWidgetsOptions;

export function inlineExtensions(options: InlineModeOptions) {
  return [
    inlineSyntaxMarks,
    ...blockWidgets(options),
    EditorView.contentAttributes.of({ 'data-mde-inline': 'true' }),
  ];
}
