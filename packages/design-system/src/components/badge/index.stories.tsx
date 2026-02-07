import { Badge } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = {
  render: () => <Badge variant="success">입금완료</Badge>,
};

export const Warning: Story = {
  render: () => <Badge variant="warning">입금전 (D-1)</Badge>,
};

export const Info: Story = {
  render: () => <Badge variant="info">100,000₩</Badge>,
};
