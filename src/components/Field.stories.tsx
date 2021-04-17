import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import { Square } from './Square';
import { Field, FieldProps } from './Field';
import { Position } from '../game/Position';
import { Range } from '../utils/Range';

export default {
  title: 'Components/Field',
  component: Field,
} as Meta;

export const Default: Story<FieldProps> = (args) => {
  const [range, setRange] = useState<Range>(Range.Zero);

  function handleRange(newRange: Range) {
    setRange(newRange);
  }

  return (
    <Field {...args} onRange={handleRange}>
      {range.map(({ x, y, key }) => (
        <Square key={key} x={x} y={y} checked={false} />
      ))}
    </Field>
  );
};

Default.args = {
  offset: new Position(0, 0),
};
