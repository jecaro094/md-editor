/**
 * tsup bundles JS/TS only; the stylesheets ship verbatim. Copy every file in
 * `src/styles/` to `dist/styles/` after each build so the `./styles/*.css`
 * subpath exports resolve.
 */
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/styles/', import.meta.url));
const dest = fileURLToPath(new URL('../dist/styles/', import.meta.url));

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`copied styles → ${dest}`);
