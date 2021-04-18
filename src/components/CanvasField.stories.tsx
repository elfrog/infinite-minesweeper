import { Meta, Story } from '@storybook/react';
import { Position } from '../game/Position';
import { CanvasField, CanvasFieldProps } from './CanvasField';
import { getCanvasSquare } from './CanvasSquare';

export default {
  title: 'Components/CanvasField',
  component: CanvasField,
} as Meta;

export const Default: Story<CanvasFieldProps> = (args) => (
  <CanvasField {...args}>
    {(range) => range.map(() => getCanvasSquare({ checked: false }))}
  </CanvasField>
);

Default.args = {
  offset: Position.Zero,
};
