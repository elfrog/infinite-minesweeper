import { Meta, Story } from '@storybook/react';
import { GameResult, GameResultProps } from './GameResult';

export default {
  title: 'Components/GameResult',
  component: GameResult,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {
    stats: {
      control: { type: 'object' },
    },
  },
  args: {
    stats: {
      mine: 10,
      checked: 200,
      flags: 100,
      correctFlags: 10,
      clicks: 50,
    },
  },
} as Meta;

export const Default: Story<GameResultProps> = (args) => (
  <GameResult {...args} />
);
