import { Input } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  render: () => (
    <Input
      inputType="text"
      value=""
      placeholder="플레이스홀더 텍스트"
      onChange={() => null}
      onClick={() => null}
      onReset={() => null}
    />
  ),
};
