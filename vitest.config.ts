import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'rjsf-uswds': fileURLToPath(new URL('./packages/rjsf-uswds/src/index.ts', import.meta.url)),
      'uswds-form-elements': fileURLToPath(
        new URL('./packages/uswds-form-elements/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/*/tests/**/*.test.{ts,tsx}', 'apps/*/tests/**/*.test.{ts,tsx}'],
  },
});
