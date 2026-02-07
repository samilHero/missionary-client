import { Tooltip } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Primary: Story = {
  render: () => <Tooltip text="This is a tooltip">Hover me</Tooltip>,
};
