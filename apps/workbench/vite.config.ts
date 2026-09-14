import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// The workbench consumes the theme package the way any app would (via its
// package name), but aliasing to source keeps dev hot-reload working without
// a separate package build step.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'rjsf-uswds/styles.css': fileURLToPath(
        new URL('../../packages/rjsf-uswds/src/styles.css', import.meta.url),
      ),
      'rjsf-uswds': fileURLToPath(
        new URL('../../packages/rjsf-uswds/src/index.ts', import.meta.url),
      ),
    },
  },
});
