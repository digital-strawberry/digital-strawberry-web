import React, { useEffect, useState } from 'react';
import { Grid, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './ImageEntity.module.css';
import { Steps } from 'shared';

export type ImageEntityProps = {
	file: File;
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file }) => {
	const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

	useEffect(() => {
		console.log('processing file...', file);

		(async () => {
			setTimeout(async () => setBuffer(await file.arrayBuffer()), Math.random() * 10000);
		})();
	}, [file]);

	return (
		<Grid.Container gap={1} className={styles.entity}>
			<Grid xs={6}>
				<div
					className={styles.spinner}
					style={buffer ? {
						backgroundImage: `url('data:${file.type};base64,${Buffer.from(buffer).toString('base64')}')`,
					} : {}}
				>
					{buffer ? null : <Spinner scale={2} />}
				</div>
			</Grid>
			<Grid xs={18}>
				<Steps index={buffer ? 1 : 0} steps={[
					{
						label: 'Загрузка изображения на сервер',
					},
					{
						label: 'Ожидание в очереди',
					},
					{
						label: 'Распознование клубники'
					},
					{
						label: 'Оценка здоровья',
					},
					{
						label: 'Подбор рекомендаций',
					},
				]} />
			</Grid>
		</Grid.Container>
	);
};
