import React, { useEffect, useState } from 'react';
import { Grid, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './ImageEntity.module.css';
import { Steps } from 'shared';

export type ImageEntityProps = {
	file: File;
	setPreview: (url: string) => void;
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file, setPreview }) => {
	const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

	useEffect(() => {
		(async () => {
			setTimeout(async () => setBuffer(await file.arrayBuffer()), Math.random() * 10000);
		})();
	}, [file]);

	const handleImageClick = () => {
		if (!buffer) {
			return;
		}

		setPreview('https://cdn.pixabay.com/photo/2020/06/19/21/46/potato-5318958_640.jpg');
	};

	return (
		<Grid.Container gap={1} className={styles.entity}>
			<Grid xs={6} onClick={handleImageClick}>
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
