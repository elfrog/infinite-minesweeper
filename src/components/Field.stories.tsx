import { Meta, Story } from '@storybook/react';
import { Square } from './Square';
import { Field, FieldProps } from './Field';
import { Position } from '../game/Position';

export default {
  title: 'Components/Field',
  component: Field,
} as Meta;

export const Default: Story<FieldProps> = (args) => (
  <Field {...args}>
    {(range) => range.map((position) => (
      <Square key={position.key} checked={false} />
    ))}
  </Field>
);

Default.args = {
  offset: Position.Zero,
};
