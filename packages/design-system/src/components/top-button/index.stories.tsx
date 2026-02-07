import { TopButton } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TopButton> = {
  component: TopButton,
};

export default meta;
type Story = StoryObj<typeof TopButton>;

export const Default: Story = {
  render: () => (
    <TopButton
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    />
  ),
};
