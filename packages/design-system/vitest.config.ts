import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const srcPath = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: [
      {
        find: '@assets/icons',
        replacement: resolve(srcPath, 'assets/icons/index.ts'),
      },
      {
        find: /^@assets\//,
        replacement: resolve(srcPath, 'assets/'),
      },
      {
        find: '@assets',
        replacement: resolve(srcPath, 'assets'),
      },
      {
        find: /^@components\//,
        replacement: resolve(srcPath, 'components/'),
      },
      {
        find: '@components',
        replacement: resolve(srcPath, 'components'),
      },
      {
        find: /^@context\//,
        replacement: resolve(srcPath, 'context/'),
      },
      {
        find: '@context',
        replacement: resolve(srcPath, 'context'),
      },
      {
        find: /^@hooks\//,
        replacement: resolve(srcPath, 'hooks/'),
      },
      {
        find: '@hooks',
        replacement: resolve(srcPath, 'hooks'),
      },
      {
        find: /^@styles\//,
        replacement: resolve(srcPath, 'styles/'),
      },
      {
        find: '@styles',
        replacement: resolve(srcPath, 'styles'),
      },
    ],
  },
});
