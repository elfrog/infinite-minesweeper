import { Meta, Story } from '@storybook/react';
import { Scoreboard, ScoreboardProps } from './Scoreboard';

export default {
  title: 'Components/Scoreboard',
  component: Scoreboard,
  argTypes: {
    checked: {
      control: { type: 'number', min: 0 },
    },
    flags: {
      control: { type: 'number', min: 0 },
    },
  },
  args: {
    checked: 12345,
    flags: 99,
    time: 60 * 19 + 55,
  },
} as Meta;

export const Default: Story<ScoreboardProps> = (args) => (
  <Scoreboard {...args} />
);
