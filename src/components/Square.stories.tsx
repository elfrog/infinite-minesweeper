import { Meta, Story } from '@storybook/react';
import { Square, SquareProps } from './Square';

export default {
  title: 'Components/Blocks/Square',
  component: Square,
} as Meta;

export const Default: Story<SquareProps> = (args) => <Square {...args} />;

Default.args = {
  x: 0,
  y: 0,
};
