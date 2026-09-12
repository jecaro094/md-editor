/**
 * Shared Markdown pipeline.
 *
 * This module is the single source of truth for how a doc's Markdown body turns
 * into HTML. It is DOM-free and CodeMirror-free on purpose: a consumer's build
 * tooling (e.g. `astro.config.mjs`) imports it via `@jecaro/md-editor/markdown`
 * to render published pages, and the editor's preview renders through the exact
 * same transforms so the two paths can never drift.
 */
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot, Element } from 'hast';
import type { VFile } from 'vfile';
import { visit, SKIP } from 'unist-util-visit';
import { toString as mdastToString } from 'mdast-util-to-string';
import remarkDirective from 'remark-directive';
import { shikiTheme } from './theme.js';

export { shikiTheme };

/**
 * Grammars Shiki loads up front. `@shikijs/rehype` otherwise defaults to
 * *every* bundled language (~200), which means ~200 dynamic `import()`s on the
 * first fenced block it sees — fine over a dev server, but in a packaged app
 * (assets served through a custom protocol) it stalls the first render for
 * seconds and, if any chunk fails to load, rejects the whole highlighter so the
 * block silently never renders. This list covers the common cases; anything
 * else is pulled in on demand via `lazy: true` (see `renderMarkdown`), falling
 * back to an unhighlighted block only if that language genuinely doesn't exist.
 */
export const shikiLangs = [
  'ts', 'tsx', 'js', 'jsx', 'json', 'jsonc',
  'html', 'css', 'scss', 'md', 'mdx', 'yaml', 'toml',
  'bash', 'shell', 'diff', 'sql', 'astro', 'vue', 'svelte',
  'python', 'rust', 'go', 'java', 'c', 'cpp', 'ruby', 'php',
] as const;

/**
 * Split a raw `.md` string into its YAML frontmatter block and the Markdown
 * body. Shared by the editor and any save/preview endpoints so all callers
 * strip frontmatter identically before rendering or validating it.
 */
export function splitFrontmatter(raw: string): {
  frontmatter: string | null;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/);
  return match
    ? { frontmatter: match[1] ?? '', body: raw.slice(match[0].length) }
    : { frontmatter: null, body: raw };
}

type AdmonitionKind = 'note' | 'info' | 'tip' | 'warning' | 'danger';

/** Container-directive names we understand, with their default title + icon. */
const ADMONITIONS: Record<AdmonitionKind, { label: string; icon: string }> = {
  note: { label: 'Note', icon: '✎' },
  info: { label: 'Info', icon: 'ℹ' },
  tip: { label: 'Tip', icon: '★' },
  warning: { label: 'Warning', icon: '▲' },
  danger: { label: 'Danger', icon: '■' },
};

/**
 * `remark` transform: turn `:::warning ... :::` container directives into
 * `<aside class="admonition admonition-warning">` blocks with a titled header.
 * An optional inline label — `:::warning[Heads up]` — overrides the default title.
 * Runs after `remark-directive`, which does the `:::` parsing.
 */
export function remarkAdmonitions() {
  return (tree: MdastRoot) => {
    visit(tree, (node: any) => {
      if (node.type !== 'containerDirective') return;
      const kind = node.name as AdmonitionKind;
      const config = ADMONITIONS[kind];
      if (!config) return; // unknown `:::name` — leave it for remark-rehype to drop

      let title = config.label;
      const first = node.children[0];
      if (first?.type === 'paragraph' && first.data?.directiveLabel) {
        title = mdastToString(first);
        node.children.shift();
      }

      const data = node.data || (node.data = {});
      data.hName = 'aside';
      data.hProperties = {
        className: ['admonition', `admonition-${kind}`],
        role: 'note',
      };

      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: 'p',
          hProperties: { className: ['admonition-title'] },
        },
        children: [
          {
            type: 'text',
            data: { hName: 'span', hProperties: { className: ['admonition-icon'], 'aria-hidden': 'true' } },
            value: config.icon,
          },
          { type: 'text', value: ` ${title}` },
        ],
      } as any);
    });
  };
}

/**
 * `remark` transform: record each fenced/indented code block's language (in
 * document order) on `file.data.codeLangs` before `remark-rehype` and Shiki
 * run. Shiki rebuilds the `<pre>`/`<code>` hast nodes from scratch — it does
 * not preserve a `language-xxx` class or any other property placed on them —
 * so this is the only point in the pipeline where the language declared on
 * the fence (```python`) is still readable. `rehypeCodeFrame` consumes the
 * queue afterwards, in the same document order, to label the code frame.
 * `file.data` is per-`VFile`, so this is safe across concurrent renders.
 */
export function remarkStashCodeLangs() {
  return (tree: MdastRoot, file: VFile) => {
    const codeLangs: (string | null)[] = ((file.data.codeLangs as (string | null)[] | undefined) ??= []);
    visit(tree, 'code', (node: any) => {
      codeLangs.push(node.lang ?? null);
    });
  };
}

/**
 * `rehype` transform: wrap every top-level `<pre>` in the `.expressive-code`
 * frame — a header bar with the fence's language label and a copy button —
 * so fenced code blocks in prose match the framed code samples the old
 * `<Code>` component produced. The button is wired by an inline script on the
 * page / preview. Must run in the same `unified` pipeline as
 * `remarkStashCodeLangs` so `file.data.codeLangs` (queued in document order)
 * lines up with the `<pre>` elements found here.
 */
export function rehypeCodeFrame() {
  return (tree: HastRoot, file: VFile) => {
    const codeLangs = (file.data.codeLangs as (string | null)[] | undefined) ?? [];
    let cursor = 0;

    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || parent == null || index == null) return;
      if (
        parent.type === 'element' &&
        Array.isArray((parent.properties?.className as unknown[])) &&
        (parent.properties!.className as unknown[]).includes('expressive-code')
      ) {
        return;
      }

      const lang = codeLangs[cursor++] ?? null;
      const label = lang?.toLowerCase() ?? null;

      const titleBar: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-title-bar'] },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['code-lang'] },
            children: label ? [{ type: 'text', value: label }] : [],
          },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              type: 'button',
              className: ['copy-btn'],
              'aria-label': 'Copy code to clipboard',
            },
            children: [{ type: 'text', value: '⧉' }],
          },
        ],
      };

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['expressive-code'] },
        children: [titleBar, node],
      };

      (parent.children as unknown[])[index] = figure;
      return [SKIP, index + 1];
    });
  };
}

/** Plugins shared by the consumer's build and the editor preview (order matters:
 * `remarkStashCodeLangs` must see the raw fence languages before anything
 * rewrites the tree; `remark-directive` parses `:::`, then `remarkAdmonitions`
 * rewrites the nodes). */
export const remarkPlugins = [remarkStashCodeLangs, remarkDirective, remarkAdmonitions];
export const rehypePlugins = [rehypeCodeFrame];

/**
 * Standalone renderer for the editor preview. Mirrors the build pipeline: same
 * remark/rehype transforms, same Shiki theme. `remark-directive` and Shiki are
 * added here explicitly because, unlike a framework's Markdown integration,
 * nothing else wires them up.
 */
export async function renderMarkdown(body: string): Promise<string> {
  const [
    { unified },
    { default: remarkParse },
    { default: remarkGfm },
    { default: remarkRehype },
    { default: rehypeShiki },
    { default: rehypeStringify },
  ] = await Promise.all([
    import('unified'),
    import('remark-parse'),
    import('remark-gfm'),
    import('remark-rehype'),
    import('@shikijs/rehype'),
    import('rehype-stringify'),
  ]);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStashCodeLangs)
    .use(remarkDirective)
    .use(remarkAdmonitions)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      theme: shikiTheme,
      // Load a small common set eagerly; fetch anything else the moment a block
      // needs it, and degrade to a plain block rather than throw if it can't be
      // resolved. See `shikiLangs`.
      langs: [...shikiLangs],
      lazy: true,
      fallbackLanguage: 'text',
    })
    .use(rehypeCodeFrame)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body);

  return String(file);
}
