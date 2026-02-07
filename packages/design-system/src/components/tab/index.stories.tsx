import { Tab } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tab> = {
  component: Tab,
};

export default meta;
type Story = StoryObj<typeof Tab>;

enum TeamType {
  PREPARE_TEAM = 'PREPARE_TEAM',
  MISSIONARY_TEAM = 'MISSIONARY_TEAM',
}

export const Primary: Story = {
  render: () => (
    <Tab
      list={[
        {
          value: TeamType.PREPARE_TEAM,
          label: '준비팀',
        },
        {
          value: TeamType.MISSIONARY_TEAM,
          label: '선교팀',
        },
      ]}
      selectedValue={TeamType.PREPARE_TEAM}
      onChange={() => null}
    />
  ),
};
