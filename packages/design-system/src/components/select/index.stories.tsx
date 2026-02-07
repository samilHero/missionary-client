import { useState } from 'react';

import { Select } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  render: () =>
    (() => {
      const [selected, setSelected] = useState<
        string | string[] | undefined | null
      >();

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
          }}
        >
          <div>
            제어 컴포넌트입니다.
            <Select
              value={selected}
              onChange={(value) => {
                setSelected(value);
              }}
            >
              <Select.Trigger>Trigger</Select.Trigger>
              <Select.Options>
                <Select.Option item="1">Option 1</Select.Option>
                <Select.Option item="2">Option 2</Select.Option>
                <Select.Option item="3">Option 3</Select.Option>
              </Select.Options>
            </Select>
          </div>

          <div>
            비제어 컴포넌트입니다.
            <Select defaultValue={'1'}>
              <Select.Trigger>Trigger</Select.Trigger>
              <Select.Options>
                <Select.Option item="1">Option 1</Select.Option>
                <Select.Option item="2">Option 2</Select.Option>
                <Select.Option item="3">Option 3</Select.Option>
              </Select.Options>
            </Select>
          </div>
        </div>
      );
    })(),
};
