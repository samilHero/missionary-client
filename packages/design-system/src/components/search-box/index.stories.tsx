import { useState } from 'react';

import { SearchBox } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchBox> = {
  component: SearchBox,
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

function DefaultStory() {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '300px' }}>
      <SearchBox
        value={value}
        onChange={setValue}
        placeholder="검색어를 입력하세요"
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};
