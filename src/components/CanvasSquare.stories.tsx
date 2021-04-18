import { Meta, Story } from '@storybook/react';
import { CanvasSquare } from './CanvasSquare';
import { SquareProps } from './Square';

export default {
  title: 'Components/CanvasSquare',
  component: CanvasSquare,
} as Meta;

const Template: Story<SquareProps> = (args) => <CanvasSquare {...args} />;

export const Unchecked = Template.bind({});
Unchecked.args = { checked: false };

export const UncheckedFlag = Template.bind({});
UncheckedFlag.args = { flag: true };

export const UncheckedItemBox = Template.bind({});
UncheckedItemBox.args = { itemBox: true };

export const CheckedEmpty = Template.bind({});
CheckedEmpty.args = { checked: true };

export const CheckedCount = Template.bind({});
CheckedCount.args = { checked: true, count: 3 };

export const CheckedMine = Template.bind({});
CheckedMine.args = { checked: true, mine: true };
