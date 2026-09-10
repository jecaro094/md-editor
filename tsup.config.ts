import { defineConfig } from 'tsup';

/**
 * Three independent entrypoints, each fully self-contained (`splitting: false`)
 * so that a consumer importing `@jecaro/md-editor/markdown` never pulls in the
 * CodeMirror graph from `core/`. This is the whole point of the export map:
 * Astro's config imports `./markdown` at build time and must stay DOM-free.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    markdown: 'src/markdown/index.ts',
    'adapters/http': 'src/adapters/http.ts',
    'adapters/local': 'src/adapters/local.ts',
  },
  format: ['esm'],
  target: 'es2022',
  platform: 'neutral',
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
});
