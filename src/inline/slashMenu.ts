/**
 * `/` slash menu. Supersedes the old `:::`-only autocompletion: typing `/` at
 * the start of a line (optionally after a list marker) offers headings, lists,
 * a blockquote, a fenced code block, a table skeleton and the five admonitions,
 * each inserted as a CodeMirror snippet with tab stops.
 */
import {
  type Completion,
  type CompletionContext,
  type CompletionResult,
  snippetCompletion,
} from '@codemirror/autocomplete';

interface SlashItem {
  label: string;
  detail: string;
  snippet: string;
}

const ADMONITIONS = ['note', 'info', 'tip', 'warning', 'danger'] as const;

const ITEMS: SlashItem[] = [
  { label: '/h1', detail: 'heading', snippet: '# ${}' },
  { label: '/h2', detail: 'heading', snippet: '## ${}' },
  { label: '/h3', detail: 'heading', snippet: '### ${}' },
  { label: '/bullet', detail: 'list', snippet: '- ${}' },
  { label: '/numbered', detail: 'list', snippet: '1. ${}' },
  { label: '/quote', detail: 'blockquote', snippet: '> ${}' },
  { label: '/code', detail: 'fenced code', snippet: '```${lang}\n${}\n```' },
  {
    label: '/table',
    detail: 'table',
    snippet: '| ${Column} | ${Column} |\n| --- | --- |\n| ${} |  |',
  },
  ...ADMONITIONS.map((k) => ({
    label: `/${k}`,
    detail: 'admonition',
    snippet: `:::${k}\n\${}\n:::\n`,
  })),
];

const OPTIONS: Completion[] = ITEMS.map((it) =>
  snippetCompletion(it.snippet, { label: it.label, detail: it.detail, type: 'keyword' }),
);

/** Only fire when the `/` opens a fresh block, not mid-sentence. */
const LINE_PREFIX = /^\s*(?:[-*+]\s+|\d+\.\s+)?$/;

export function slashSource(context: CompletionContext): CompletionResult | null {
  const token = context.matchBefore(/\/[\w-]*/);
  if (!token || (token.from === token.to && !context.explicit)) return null;

  const line = context.state.doc.lineAt(token.from);
  if (!LINE_PREFIX.test(context.state.doc.sliceString(line.from, token.from))) return null;

  return { from: token.from, options: OPTIONS, filter: true };
}
