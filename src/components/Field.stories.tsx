import { Meta, Story } from '@storybook/react';
import { Block } from './Block';
import { Square } from './Square';
import { Field, FieldProps, FieldRangeIterator } from './Field';
import { Position } from '../game/Position';

export default {
  title: 'Components/Field',
  component: Field,
} as Meta;

export const Default: Story<FieldProps> = args => {
  return (
    <Field {...args}>
      {range => (
        Array.from(FieldRangeIterator(range)).map(({ x, y, key }) => (
          <Square key={key} x={x} y={y}>
            <Block />
          </Square>
        ))
      )}
    </Field>
  );
};

Default.args = {
  offset: new Position(0, 0),
};
