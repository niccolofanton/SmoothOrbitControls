import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const demoDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(demoDir, '..');
const modules = path.resolve(demoDir, 'node_modules');

/**
 * The demo imports the real component from the repository root
 * (`../SmoothOrbitControls.tsx`) instead of copying it, so the deployed page always
 * exercises the file the repo is about.
 *
 * Two consequences handled here:
 *  - the dev server has to be allowed to read one level above its root;
 *  - Node resolution starting from the repo root finds no `node_modules`, so the bare
 *    specifiers used by the component are pinned to the demo's own dependencies.
 */
const dependencies = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'three',
  '@react-three/fiber',
  '@react-three/drei',
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: dependencies.map((find) => ({ find, replacement: path.join(modules, find) })),
  },
  server: {
    fs: { allow: [repoRoot] },
  },
});
