import { Meta, Story } from '@storybook/react';
import { Square, SquareProps } from './Square';

export default {
  title: 'Components/Square',
  component: Square,
} as Meta;

const Template: Story<SquareProps> = (args) => <Square {...args} />;

export const Unchecked = Template.bind({});
Unchecked.args = {
  x: 0, y: 0, checked: false,
};

export const UncheckedFlag = Template.bind({});
UncheckedFlag.args = {
  x: 0, y: 0, flag: true,
};

export const UncheckedItemBox = Template.bind({});
UncheckedItemBox.args = {
  x: 0, y: 0, itemBox: true,
};

export const CheckedEmpty = Template.bind({});
CheckedEmpty.args = {
  x: 0, y: 0, checked: true,
};

export const CheckedCount = Template.bind({});
CheckedCount.args = {
  x: 0, y: 0, checked: true, count: 3,
};

export const CheckedMine = Template.bind({});
CheckedMine.args = {
  x: 0, y: 0, checked: true, mine: true,
};
