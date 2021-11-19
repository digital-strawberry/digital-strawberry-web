import React from 'react';

import { Button, Grid, Page, Text } from '@geist-ui/react';

export type MainPageProps = Record<never, string>;

export const MainPage: React.FC<MainPageProps> = () => {
	return (
		<Page width='800px' padding={0}>
			<Text>Просмотр клубнички</Text>

			<Grid.Container justify='center' gap={3} mt='100px'>
				<Grid xs={20} sm={7} justify='center'>
					<Button shadow type='secondary-light' width='100%'>
						GitHub Repo
					</Button>
				</Grid>
				<Grid xs={0} sm={3} />
				<Grid xs={20} sm={7} justify='center'>
					<Button width='100%'>
						Documentation Site
					</Button>
				</Grid>
			</Grid.Container>
		</Page>
	);
};
