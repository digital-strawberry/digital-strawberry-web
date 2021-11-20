import React, { useEffect, useState } from 'react';
import { Grid, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './ImageEntity.module.css';
import { Steps } from 'shared';
import ky from 'ky';

export type ImageEntityProps = {
	file: File;
	setPreview: (url: string) => void;
};

enum Stages {
	Upload,
	Queued,
	Detection,
	Recommendation,
}

const prefixUrl = 'https://strawberry.ktsd.cc/api';

export const ImageEntity: React.FC<ImageEntityProps> = ({ file, setPreview }) => {
	const [stage, setStage] = useState<Stages>(Stages.Upload);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const form = new FormData();
			const buffer = await file.arrayBuffer();
			const blob = new Blob([buffer], {
				type: file.type,
			});

			setBuffer(buffer, file.type)

			form.append('image', blob, 'image.jpg')

			try {
				const { renderedImgUrl } = await ky('predict', {
					prefixUrl,
					method: 'POST',
					body: form,
				}).json<{ renderedImgUrl: string; }>();

				setStage(Stages.Queued);

				const buffer = await ky(renderedImgUrl.slice(1), {
					prefixUrl,
				}).arrayBuffer();

				setStage(Stages.Detection);
				setBuffer(buffer, 'image/jpeg');
			}
			catch (e) {
				console.error('oh no');
				console.log(e);
			}
		})();
	}, [file]);

	const handleImageClick = () => {
		if (!url) {
			return;
		}

		setPreview(url);
	};

	const setBuffer = (buffer: ArrayBuffer, type: string) => {
		setUrl(`data:${type};base64,${Buffer.from(buffer).toString('base64')}`);
	};

	return (
		<Grid.Container gap={1} className={styles.entity}>
			<Grid xs={6} onClick={handleImageClick}>
				<div
					className={styles.spinner}
					style={url ? { backgroundImage: `url('${url}')` } : {}}
				>
					{url ? null : <Spinner scale={2} />}
				</div>
			</Grid>
			<Grid xs={18}>
				<Steps index={stage} steps={[
					{
						label: 'Загрузка изображения на сервер',
					},
					{
						label: 'Ожидание в очереди',
					},
					{
						label: 'Детекция клубники',
					},
					{
						label: 'Подбор рекомендаций',
					},
				]} />
			</Grid>
		</Grid.Container>
	);
};
