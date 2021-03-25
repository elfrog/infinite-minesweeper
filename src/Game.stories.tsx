import { Meta, Story } from '@storybook/react';
import Game from './Game';

export default {
  title: 'Scenes/Game',
  component: Game,
} as Meta;

export const Default: Story = args => <Game />;
