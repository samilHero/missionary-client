import { Chips } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Chips> = {
  component: Chips,
};

export default meta;
type Story = StoryObj<typeof Chips>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chips>태그1</Chips>
      <Chips>태그2</Chips>
      <Chips>필터</Chips>
    </div>
  ),
};
