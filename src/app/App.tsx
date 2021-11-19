import React from 'react';

import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { MainPage } from '../pages';
import { Navbar } from '../features';

export const App = () => {
	return (
		<GeistProvider themeType={'dark'}>
			<CssBaseline />
			<Navbar />
			<MainPage />
		</GeistProvider>
	);
};
