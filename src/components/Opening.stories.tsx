import { Meta, Story } from '@storybook/react';
import { BRAND } from '../constants';
import { Opening, OpeningProps } from './Opening';

export default {
  title: 'Components/Opening',
  component: Opening,
  argTypes: {
    brand: {
      control: { type: 'text' },
    },
  },
  args: {
    brand: BRAND,
  },
} as Meta;

export const Default: Story<OpeningProps> = (args) => (
  <Opening {...args} />
);
