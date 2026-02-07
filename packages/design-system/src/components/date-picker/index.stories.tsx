import React, { useState } from 'react';

import { DatePicker } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

function DefaultStory() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div style={{ width: '320px' }}>
      <DatePicker
        label="날짜 선택"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholder="YYYY-MM-DD"
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

function WithLabelStory() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div style={{ width: '320px' }}>
      <DatePicker
        label="예약 날짜"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholder="YYYY-MM-DD"
      />
    </div>
  );
}

export const WithLabel: Story = {
  render: () => <WithLabelStory />,
};

function WithErrorStory() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div style={{ width: '320px' }}>
      <DatePicker
        label="생년월일"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholder="YYYY-MM-DD"
        error="올바른 날짜를 입력해주세요"
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
      <DatePicker
        label="비활성 상태"
        selected={new Date()}
        onChange={() => {}}
        placeholder="YYYY-MM-DD"
        disabled
      />
    </div>
  ),
};

function RangeStory() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div style={{ width: '660px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <DatePicker
          label="시작일"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholder="YYYY-MM-DD"
        />
      </div>
      <div style={{ flex: 1 }}>
        <DatePicker
          label="종료일"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || undefined}
          placeholder="YYYY-MM-DD"
        />
      </div>
    </div>
  );
}

export const Range: Story = {
  render: () => <RangeStory />,
};
