import { useState } from 'react';

import { Pagination } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function DefaultStory() {
  const [page, setPage] = useState(1);

  return (
    <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

function FewPagesStory() {
  const [page, setPage] = useState(1);

  return (
    <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
  );
}

export const FewPages: Story = {
  render: () => <FewPagesStory />,
};
