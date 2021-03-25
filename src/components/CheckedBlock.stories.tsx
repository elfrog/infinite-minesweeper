import { Meta, Story } from '@storybook/react';
import { CheckedBlock, CheckedBlockProps } from './CheckedBlock';
import { Square } from './Square';

export default {
  title: 'Components/Blocks/CheckedBlock',
  component: CheckedBlock,
} as Meta;

export const Default: Story<CheckedBlockProps> = args => (
  <Square x={0} y={0}>
    <CheckedBlock {...args} />
  </Square>
);

Default.args = {
  count: 3,
  mine: false,
};

export const Mine = Default.bind({});

Mine.args = {
  count: 0,
  mine: true
};
