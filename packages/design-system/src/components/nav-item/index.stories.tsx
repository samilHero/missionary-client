import { NavItem, NavItemProps } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<NavItemProps> = {
  title: 'Components/NavItem',
  component: NavItem,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111111' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<NavItemProps>;

export const ParentCollapsed: Story = {
  args: {
    label: 'Parent Item',
    hasChildren: true,
    isExpanded: false,
    depth: 0,
  },
};

export const ParentExpanded: Story = {
  args: {
    label: 'Parent Item',
    hasChildren: true,
    isExpanded: true,
    depth: 0,
  },
};

export const ParentActive: Story = {
  args: {
    label: 'Parent Item',
    hasChildren: true,
    isExpanded: true,
    isActive: true,
    depth: 0,
  },
};

export const Child: Story = {
  args: {
    label: 'Child Item',
    hasChildren: false,
    depth: 1,
  },
};

export const ChildActive: Story = {
  args: {
    label: 'Child Item',
    hasChildren: false,
    isActive: true,
    depth: 1,
  },
};

export const LinkItem: Story = {
  args: {
    label: 'Link Item',
    href: '#',
    depth: 0,
  },
};
