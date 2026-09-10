/**
 * HTTP adapters: talk to a backend that owns the Markdown pipeline and the
 * filesystem. `tech-docs` uses these so the byte-for-byte invariant with its
 * static build is preserved and no rendering code ships to the browser.
 */
import type { Renderer } from '../types.js';

export interface RemoteRendererOptions {
  /** Extra headers to send with each preview request. */
  headers?: Record<string, string>;
}

/**
 * A {@link Renderer} that POSTs `{ content }` to `url` and expects
 * `{ html: string }` back. Any non-2xx response is thrown, using the body's
 * `error` field as the message when present.
 */
export function remoteRenderer(
  url: string,
  options: RemoteRendererOptions = {},
): Renderer {
  return {
    async render(markdown: string): Promise<string> {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...options.headers },
        body: JSON.stringify({ content: markdown }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        html?: string;
        error?: string;
      };
      if (!res.ok || typeof data.html !== 'string') {
        throw new Error(data.error ?? `Preview failed (${res.status})`);
      }
      return data.html;
    },

    async renderBlocks(sources: string[]): Promise<string[]> {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...options.headers },
        body: JSON.stringify({ blocks: sources }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        htmls?: unknown;
        error?: string;
      };
      if (!res.ok || !Array.isArray(data.htmls)) {
        throw new Error(data.error ?? `Preview failed (${res.status})`);
      }
      return data.htmls.map((h) => (typeof h === 'string' ? h : ''));
    },
  };
}

export interface HttpSaveOptions {
  headers?: Record<string, string>;
  /** Merged into the JSON body alongside `content` (e.g. `{ slug }`). */
  extra?: Record<string, unknown>;
}

/**
 * Build an `onSave` handler that POSTs `{ ...extra, content }` to `url`. Throws
 * on a non-2xx response or a body without `ok: true`, so `mountEditor` shows the
 * failure toast and keeps the dirty flag set.
 */
export function httpSave(
  url: string,
  options: HttpSaveOptions = {},
): (content: string) => Promise<void> {
  return async (content: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...options.headers },
      body: JSON.stringify({ ...options.extra, content }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? `Save failed (${res.status})`);
    }
  };
}
