import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import { Square } from './Square';
import {
  Field,
  FieldProps,
  FieldRangeIterator,
  Range,
} from './Field';
import { Position } from '../game/Position';

export default {
  title: 'Components/Field',
  component: Field,
} as Meta;

export const Default: Story<FieldProps> = (args) => {
  const [range, setRange] = useState<Range>();

  function handleRange(newRange: Range) {
    setRange(newRange);
  }

  return (
    <Field {...args} onRange={handleRange}>
      {range && Array.from(FieldRangeIterator(range)).map(({ x, y, key }) => (
        <Square key={key} x={x} y={y} checked={false} />
      ))}
    </Field>
  );
};

Default.args = {
  offset: new Position(0, 0),
};
