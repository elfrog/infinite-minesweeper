import { Meta, Story } from '@storybook/react';
import { SlidingDigit, SlidingDigitProps } from './SlidingDigit';

export default {
  title: 'Components/SlidingDigit',
  component: SlidingDigit,
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 9 },
    },
    position: {
      control: { type: 'number', min: 0 },
    },
  },
  args: {
    value: 3,
    position: 0,
  },
} as Meta;

export const Default: Story<SlidingDigitProps> = (args) => (
  <SlidingDigit {...args} />
);
