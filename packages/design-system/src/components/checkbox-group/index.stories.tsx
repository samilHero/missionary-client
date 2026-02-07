import classnames from 'classnames';
import { useState } from 'react';

import { Text } from '../text';

import { CheckboxGroup } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CheckboxGroup> = {
  component: CheckboxGroup,
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Primary: Story = {
  render: (args) =>
    (() => {
      const [checked, setChecked] = useState<string[]>([]);

      return (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Text typo="h2">제어 컴포넌트</Text>
            <CheckboxGroup
              {...args}
              checkedValues={checked}
              onChange={(newChecked) => {
                console.log(newChecked);
                setChecked(newChecked);
              }}
            >
              <div className="flex flex-col gap-4">
                <CheckboxGroup.Item value={'value1'}>
                  <span
                    className={classnames(
                      'relative inline-block w-4 h-4 mr-2 border border-black',
                      checked.includes('value1') &&
                        "after:content-['V'] after:text-base after:font-bold after:w-4 after:h-4 after:text-center after:absolute after:left-0 after:top-0",
                    )}
                  />
                  Checkbox1
                </CheckboxGroup.Item>
                <CheckboxGroup.Item value={'value2'}>
                  <span
                    className={classnames(
                      'relative inline-block w-4 h-4 mr-2 border border-black',
                      checked.includes('value2') &&
                        "after:content-['V'] after:text-base after:font-bold after:w-4 after:h-4 after:text-center after:absolute after:left-0 after:top-0",
                    )}
                  />
                  Checkbox2
                </CheckboxGroup.Item>
              </div>
            </CheckboxGroup>
          </div>
        </div>
      );
    })(),
  args: {},
};
