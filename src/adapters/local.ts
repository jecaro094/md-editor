/**
 * In-browser renderer: runs the shared remark/rehype pipeline (`../markdown`)
 * on the client, no backend. Meant for the standalone demo and for consumers
 * without an API route. `tech-docs` deliberately does NOT use this — it renders
 * remotely so the preview stays byte-identical to its static build.
 *
 * Importing this pulls the unified/remark/rehype/Shiki graph into the client
 * bundle, which is why it is its own entrypoint (`@jecaro/md-editor/adapters/local`)
 * and never reachable from `@jecaro/md-editor` itself.
 */
import { renderMarkdown, splitFrontmatter } from '../markdown/index.js';
import type { Renderer } from '../types.js';

export function localRenderer(): Renderer {
  return {
    render: (md) => renderMarkdown(splitFrontmatter(md).body),
    renderBlocks: (sources) => Promise.all(sources.map((s) => renderMarkdown(s))),
  };
}
