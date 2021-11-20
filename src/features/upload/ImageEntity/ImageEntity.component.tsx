import React, { useEffect, useState } from 'react';
import { Description, Grid, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import ky from 'ky';
import styles from './ImageEntity.module.css';
import { DataNode, DataTree, Steps } from 'shared';
import { Recommendations } from './Recommendations';

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

const postData = async <T extends Record<string | number, unknown>>(method: string, buffer: ArrayBuffer, mime: string): Promise<T> => {
	const prefixUrl = 'https://strawberry.ktsd.cc/api/';

	const form = new FormData();
	const blob = new Blob([buffer], {
		type: mime,
	});

	form.append('image', blob, 'image.jpg');

	const response = await ky(method, {
		prefixUrl,
		method: 'POST',
		body: form,
	}).json() as T;

	for (const key in Object.keys(response)) {
		if (key.toLowerCase().endsWith('url') && typeof response[key] === 'string') {
			response[key] = prefixUrl + String(response[key]).slice(1);
		}
	}

	return response;
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file, setPreview }) => {
	const [stage, setStage] = useState<Stages>(Stages.Upload);
	const [url, setUrl] = useState<string | null>(null);
	const [rawData, setRawData] = useState<DataNode | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const buffer = await file.arrayBuffer();
				setBuffer(buffer, file.type)

				const data = await postData<{ renderedImgUrl: string; predictions: Array<Record<string, number>>; }>(
					'predictStrawberriesBoundingBoxes', buffer,
					file.type,
				);

				setStage(Stages.Queued);
				setRawData(data);

				// const buffer = await ky(data.renderedImgUrl.slice(1), {
				// 	prefixUrl,
				// }).arrayBuffer();
				//
				// setStage(Stages.Detection);
				// setBuffer(buffer, 'image/jpeg');
			}
			catch (e) {
				console.error(e);
				setError(e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error');
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
		<Grid.Container gap={2} className={styles.entity}>
			<Grid xs={6} onClick={handleImageClick}>
				<div
					className={styles.spinner}
					style={url ? { backgroundImage: `url('${url}')` } : {}}
				>
					{url ? null : <Spinner scale={2} />}
				</div>
			</Grid>
			<Grid xs={18}>
				<Grid.Container gap={1}>
					<Grid xs={12}>
						<Description title='Статус обработки' content={
							<Steps
								index={stage}
								error={error}
								steps={[
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
								]}
							/>
						} />
					</Grid>

					<Grid xs={12}>
						<Description title='Сырые данные с сервера' content={rawData ? <DataTree data={rawData} /> : <Spinner />} />
					</Grid>

					<Grid xs={24}>
						<Description title='Рекомендации по уходу за кустом' content={
							<Recommendations recommendations={[
								{
									type: 'air-hi',
									description: 'too hot',
								},
								{
									type: 'hum-lo',
									description: 'vlaga',
								},
								{
									type: 'azot-lo',
									description: 'gib azot pls sir'
								}
							]} />
						} />
					</Grid>
				</Grid.Container>
			</Grid>
		</Grid.Container>
	);
};
