import React from 'react';

import { Page } from '@geist-ui/react';
import { Upload } from 'features';

export type MainPageProps = Record<never, string>;

export const MainPage: React.FC<MainPageProps> = () => {
	return (
		<Page width='1000px' padding={0}>
			<Upload />
		</Page>
	);
};
