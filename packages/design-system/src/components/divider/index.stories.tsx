import { Divider } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Divider> = {
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '300px',
      }}
    >
      <Divider height={4} />
      <Divider height={10} />
      <Divider height={12} />
      <Divider height={24} />
    </div>
  ),
};
