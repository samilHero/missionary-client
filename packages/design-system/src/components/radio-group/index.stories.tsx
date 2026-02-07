import classnames from 'classnames';
import { useState } from 'react';

import { Radio } from '../radio';
import { Text } from '../text';

import { RadioGroup } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const dataList = ['짜장면', '짬뽕', '탕수육'];

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const RadioGroupComponent = ({
  args,
}: {
  args: React.ComponentProps<typeof RadioGroup>;
}) => {
  const [checked, setChecked] = useState<string>(dataList[1]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Text typo="h2">제어 컴포넌트</Text>
        <RadioGroup
          {...args}
          value={checked}
          onChange={(newChecked) => setChecked(newChecked)}
          className={classnames(args.disabled && 'cursor-not-allowed')}
        >
          <div className="flex flex-col gap-4">
            {dataList.map((data) => (
              <Radio
                key={data}
                value={data}
                className="flex items-center w-[200px] cursor-pointer"
              >
                <span
                  className={classnames(
                    'relative inline-block w-4 h-4 mr-2 border border-black rounded-full',
                    checked === data &&
                      "after:content-['v'] after:text-base after:font-bold after:w-4 after:h-4 after:text-center after:absolute after:left-0 after:top-0",
                  )}
                />
                {data}
              </Radio>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export const Primary: Story = {
  render: (args) => <RadioGroupComponent args={args} />,
  args: {
    disabled: false,
  },
};
