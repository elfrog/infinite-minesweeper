import { Meta, Story } from '@storybook/react';
import { FieldState } from '../game/FieldState';
import { Position, PositionTuple } from '../game/Position';
import { FieldMiniMap, FieldMiniMapProps } from './FieldMiniMap';

const checkPositions: PositionTuple[] = [
  [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],
  [1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5],
];

const mockFieldState = checkPositions.reduce(
  (fieldState, p) => fieldState.checkBlock(new Position(...p))[0],
  new FieldState(),
);

export default {
  title: 'Components/FieldMiniMap',
  component: FieldMiniMap,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} as Meta;

const Template: Story<FieldMiniMapProps> = (args) => <FieldMiniMap {...args} />;

export const Default = Template.bind({});
Default.args = {
  fieldState: mockFieldState,
};
