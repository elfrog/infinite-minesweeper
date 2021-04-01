import { Meta, Story } from '@storybook/react';
import { Block, BlockProps } from './Block';
import { Square } from './Square';

export default {
  title: 'Components/Blocks/Block',
  component: Block,
} as Meta;

export const Default: Story<BlockProps> = (args) => (
  <Square x={0} y={0}>
    <Block {...args} />
  </Square>
);

Default.args = {
  itemBox: false,
};

export const Pushed = Default.bind({});

Pushed.args = {
  pushed: true,
};

export const Flag = Default.bind({});

Flag.args = {
  flag: true,
};

export const ItemBox = Default.bind({});

ItemBox.args = {
  itemBox: true,
};
