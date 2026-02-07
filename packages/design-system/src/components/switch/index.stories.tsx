import classnames from 'classnames';
import { useState } from 'react';

import { Switch } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Primary: Story = {
  render: (args) =>
    (() => {
      const [checked, setChecked] = useState(false);

      return (
        <div className="relative flex items-center">
          <Switch
            {...args}
            checked={checked}
            onChange={(newChecked) => {
              setChecked(newChecked);
            }}
            value={'value'}
            className={classnames(
              'relative inline-block w-[60px] h-[34px] rounded-[34px] cursor-pointer hover:bg-gray-50',
              checked ? 'bg-blue-50' : 'bg-gray-30',
            )}
          >
            <span
              className={classnames(
                'absolute inset-0 rounded-[34px] transition-all duration-400',
                "before:content-[''] before:absolute before:bottom-1 before:left-1 before:w-[26px] before:h-[26px] before:rounded-full before:bg-white before:transition-all before:duration-400",
                checked && 'before:translate-x-[26px]',
              )}
            />
          </Switch>
        </div>
      );
    })(),
  args: {},
};
