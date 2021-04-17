import { Meta, Story } from '@storybook/react';
import { GameContainer, GameContainerProps } from './GameContainer';
import { Default as Field } from './Field.stories';
import { Position } from '../game/Position';

export default {
  title: 'Components/GameContainer',
  component: GameContainer,
  argTypes: {
    isPaused: {
      control: { type: 'boolean' },
    },
  },
  args: {
    isPaused: false,
  },
} as Meta;

export const Default: Story<GameContainerProps> = (args) => (
  <GameContainer {...args}>
    <Field offset={Position.Zero} />
  </GameContainer>
);
