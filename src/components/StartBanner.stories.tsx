import { Meta, Story } from '@storybook/react';
import { StartBanner, StartBannerProps } from './StartBanner';

export default {
  title: 'Components/StartBanner',
  component: StartBanner,
} as Meta;

export const Default: Story<StartBannerProps> = (args) => <StartBanner {...args} />;
