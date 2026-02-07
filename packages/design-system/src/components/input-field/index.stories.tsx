import { useState } from 'react';

import { InputField } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InputField> = {
  component: InputField,
};

export default meta;
type Story = StoryObj<typeof InputField>;

function DefaultStory() {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '320px' }}>
      <InputField
        label="라벨"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="플레이스홀더 텍스트"
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

function WithClearButtonStory() {
  const [value, setValue] = useState('입력된 텍스트');

  return (
    <div style={{ width: '320px' }}>
      <InputField
        label="Clear 버튼 포함"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="플레이스홀더 텍스트"
      />
    </div>
  );
}

export const WithClearButton: Story = {
  render: () => <WithClearButtonStory />,
};

function WithErrorStory() {
  const [value, setValue] = useState('잘못된 입력');

  return (
    <div style={{ width: '320px' }}>
      <InputField
        label="라벨"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        error="에러 메시지입니다"
      />
    </div>
  );
}

export const WithError: Story = {
  render: () => <WithErrorStory />,
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <InputField
        label="라벨"
        value="비활성 상태"
        placeholder="비활성 상태"
        disabled
      />
    </div>
  ),
};
