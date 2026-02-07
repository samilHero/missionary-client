import { resolve } from 'path';

import svgr from 'vite-plugin-svgr';

import type { ViteFinal } from '@storybook/builder-vite';
import type { StorybookConfig } from '@storybook/react-vite';

const viteFinal: ViteFinal = (viteConfig) => {
  return {
    ...viteConfig,
    plugins: [
      ...(viteConfig.plugins ?? []),
      svgr({
        svgrOptions: { exportType: 'default' },
        include: '**/*.svg',
      }),
    ],
    resolve: {
      ...viteConfig.resolve,
      alias: {
        '@assets': resolve(__dirname, '../src/assets'),
        '@components': resolve(__dirname, '../src/components'),
        '@context': resolve(__dirname, '../src/context'),
        '@hooks': resolve(__dirname, '../src/hooks'),
        '@styles': resolve(__dirname, '../src/styles'),
      },
    },
  };
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  viteFinal,
};

export default config;
