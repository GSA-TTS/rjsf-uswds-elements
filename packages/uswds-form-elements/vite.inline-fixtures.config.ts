import { mergeConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import config from './vite.config.js';

export default mergeConfig(config, {
  build: {
    lib: {
      entry: {
        'test-fixtures/inline-styles': fileURLToPath(
          new URL('./src/test-fixtures/inline-styles.ts', import.meta.url),
        ),
      },
      formats: ['es'],
    },
  },
});
