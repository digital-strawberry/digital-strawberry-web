import React from 'react';
import { Page } from '@geist-ui/react';
import { Upload } from 'features';
import styles from './Main.module.css';

export type MainPageProps = Record<never, string>;

export const MainPage: React.FC<MainPageProps> = () => {
	return (
		<Page width='1000px' className={styles.page}>
			<Upload />
		</Page>
	);
};
