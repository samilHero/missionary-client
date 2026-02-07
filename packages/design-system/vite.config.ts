import { resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const srcPath = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
      include: '**/*.svg',
    }),
    dts({
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
      insertTypesEntry: true,
    }),
  ],
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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'SamilheroDesignSystem',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: 'styles/[name][extname]',
      },
    },
    cssCodeSplit: false,
  },
});
