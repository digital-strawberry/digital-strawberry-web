import type { Meta, Story } from '@storybook/react';
import type { MainPageProps } from './Main.page';
import { MainPage } from './Main.page';

export default {
    component: MainPage,
    title: 'pages/Main',
} as Meta<MainPageProps>;

export const Main: Story<MainPageProps> = (props) => <MainPage {...props} />;
