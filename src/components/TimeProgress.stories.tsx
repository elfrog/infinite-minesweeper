import { Meta, Story } from '@storybook/react';
import { TimeProgress, TimeProgressProps } from './TimeProgress';

export default {
  title: 'Components/TimeProgress',
  component: TimeProgress,
  argTypes: {
    value: {
      control: { type: 'number', min: 0 },
    },
    max: {
      control: { type: 'number', min: 0 },
    },
  },
  args: {
    value: 8,
    max: 10,
  },
} as Meta;

export const Default: Story<TimeProgressProps> = (args) => (
  <TimeProgress {...args} />
);
