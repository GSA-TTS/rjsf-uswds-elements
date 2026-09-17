import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const uswdsPackageRoot = fileURLToPath(
  new URL('../../node_modules/@uswds/uswds/', import.meta.url),
);
const uswdsPackagesRoot = fileURLToPath(
  new URL('../../node_modules/@uswds/uswds/packages/', import.meta.url),
);

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [uswdsPackagesRoot, uswdsPackageRoot],
      },
    },
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        define: fileURLToPath(new URL('./src/define.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit'],
    },
  },
});
