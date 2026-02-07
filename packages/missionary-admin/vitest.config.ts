import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const designSystemPath = path.resolve(__dirname, '../design-system/src');

const resolveDesignSystemAliases = {
  name: 'resolve-design-system-aliases',
  enforce: 'pre' as const,
  resolveId(id: string, importer?: string) {
    // Handle SVG imports - mock them immediately
    if (id.endsWith('.svg')) {
      return '\0virtual:svg-mock';
    }

    // Handle @assets/icons specifically
    if (id === '@assets/icons') {
      return path.resolve(designSystemPath, 'assets/icons/index.ts');
    }
    if (id.startsWith('@assets')) {
      let resolved = path.resolve(
        designSystemPath,
        id.replace('@assets', 'assets'),
      );
      // If it's a directory, resolve to index.ts
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.resolve(resolved, 'index.ts');
      }
      return resolved;
    }
    if (id.startsWith('@components')) {
      let resolved = path.resolve(
        designSystemPath,
        id.replace('@components', 'components'),
      );
      // If it's a directory, resolve to index.tsx
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.resolve(resolved, 'index.tsx');
      }
      return resolved;
    }
    if (id.startsWith('@context')) {
      let resolved = path.resolve(
        designSystemPath,
        id.replace('@context', 'context'),
      );
      // If it's a directory, resolve to index.ts
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.resolve(resolved, 'index.ts');
      }
      return resolved;
    }
    if (id.startsWith('@hooks')) {
      let resolved = path.resolve(
        designSystemPath,
        id.replace('@hooks', 'hooks'),
      );
      // If it's a directory, resolve to index.ts
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.resolve(resolved, 'index.ts');
      }
      return resolved;
    }
    if (id.startsWith('@styles')) {
      let resolved = path.resolve(
        designSystemPath,
        id.replace('@styles', 'styles'),
      );
      // If it's a directory, resolve to index.ts
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.resolve(resolved, 'index.ts');
      }
      return resolved;
    }
  },
  load(id: string) {
    if (id === '\0virtual:svg-mock') {
      return 'export default "svg-mock";';
    }
  },
} as const;

export default defineConfig({
  plugins: [react(), tsconfigPaths(), resolveDesignSystemAliases],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  assetsInclude: ['**/*.svg'],
  resolve: {
    alias: [
      // Design system aliases (must be before generic @assets)
      // These are needed for imports from design-system components
      {
        find: /^@assets\/icons$/,
        replacement: path.resolve(designSystemPath, 'assets/icons/index.ts'),
      },
      {
        find: /^@assets\/icons\//,
        replacement: path.resolve(designSystemPath, 'assets/icons/'),
      },
      {
        find: /^@assets\//,
        replacement: path.resolve(designSystemPath, 'assets/'),
      },
      {
        find: '@assets',
        replacement: path.resolve(designSystemPath, 'assets'),
      },
      {
        find: /^@components\//,
        replacement: path.resolve(designSystemPath, 'components/'),
      },
      {
        find: '@components',
        replacement: path.resolve(designSystemPath, 'components'),
      },
      {
        find: /^@context\//,
        replacement: path.resolve(designSystemPath, 'context/'),
      },
      {
        find: '@context',
        replacement: path.resolve(designSystemPath, 'context'),
      },
      {
        find: /^@hooks\//,
        replacement: path.resolve(designSystemPath, 'hooks/'),
      },
      { find: '@hooks', replacement: path.resolve(designSystemPath, 'hooks') },
      {
        find: /^@styles\//,
        replacement: path.resolve(designSystemPath, 'styles/'),
      },
      {
        find: '@styles',
        replacement: path.resolve(designSystemPath, 'styles'),
      },
      // Local src aliases (baseUrl: "./src")
      { find: 'apis', replacement: path.resolve(__dirname, './src/apis') },
      { find: 'hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: 'lib', replacement: path.resolve(__dirname, './src/lib') },
      {
        find: 'components',
        replacement: path.resolve(__dirname, './src/components'),
      },
      { find: 'utils', replacement: path.resolve(__dirname, './src/utils') },
      {
        find: /\.svg$/,
        replacement: path.resolve(__dirname, './src/test/svg-mock.ts'),
      },
    ],
  },
});
