import { IconButton, IconButtonProps } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'ghost'],
    },
    label: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <SearchIcon />,
  },
};

export const WithLabel: Story = {
  args: {
    icon: <SearchIcon />,
    label: 'Search',
  },
};

export const Sizes: Story = {
  render: (args: IconButtonProps) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
  args: {
    icon: <SearchIcon />,
  },
};

export const Variants: Story = {
  render: (args: IconButtonProps) => (
    <div className="flex items-center gap-4 p-4 rounded">
      <IconButton {...args} variant="ghost" label="Ghost" />
      <IconButton {...args} variant="filled" label="Filled" />
    </div>
  ),
  args: {
    icon: <SearchIcon />,
  },
};

export const Filled: Story = {
  args: {
    icon: <SearchIcon />,
    variant: 'filled',
  },
};

export const FilledWithLabel: Story = {
  args: {
    icon: <SearchIcon />,
    label: 'Search',
    variant: 'filled',
  },
};
