import { defineConfig } from 'vite';

/**
 * Vite config for the Tauri front-end. Mirrors the settings Tauri's own
 * `create-tauri-app` template ships: a fixed dev port so `tauri.conf.json`'s
 * `devUrl` can point at it, `clearScreen: false` so Rust's compiler output stays
 * visible, and an `esnext` build target because the app only ever runs in the
 * bundled WKWebView (no legacy-browser downlevelling needed).
 *
 * `main.ts` imports `../src/*.ts` from the parent package directly, exactly like
 * `playground/` does; the remark/rehype/Shiki graph resolves up into the repo
 * root `node_modules`.
 */
export default defineConfig({
  root: '.',
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
