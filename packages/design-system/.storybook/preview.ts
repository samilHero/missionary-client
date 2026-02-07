import { Preview } from '@storybook/react';
import '../src/styles/tailwind.css';
import '../src/styles/_global.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
