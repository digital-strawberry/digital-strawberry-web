import React, { useEffect, useState } from 'react';
import { Grid, Image, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './ImageEntity.module.css';

export type ImageEntityProps = {
	file: File;
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file }) => {
	const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

	useEffect(() => {
		console.log('processing file...', file);

		(async () => {
			setBuffer(await file.arrayBuffer());
		})();
	}, []);

	return (
		<Grid.Container gap={1} className={styles.entity}>
			<Grid xs={6}>
				{buffer ? (
					<Image
						src={`data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`}
						className={styles.preview}
						height={'100%'}
						width={'300px'}
					/>
				) : (
					<div className={styles.spinner}>
						<Spinner />
					</div>
				)}
			</Grid>
			<Grid xs={18}><Spinner /> Cooking...</Grid>
		</Grid.Container>
	);
};
