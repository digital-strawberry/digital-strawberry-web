import React, { useEffect, useState } from 'react';
import { Description, Grid, Spinner, Text } from '@geist-ui/react';
import ky from 'ky';
import styles from './ImageEntity.module.scss';
import { DataTree, Steps } from 'shared';
import { Recommendations, RecommendationsProps } from './Recommendations';
import { Preview } from 'shared';

export type ImageEntityProps = {
	file: File;
	setPreview: (url: string) => void;
};

enum Stages {
	BBoxes,
	HealthCheck,
	Done,
}

type BBoxesResponse = {
	imgUrl: string;
	renderedImgUrl: string;
	predictions: Array<Record<'confidence' | 'maturity' | 'xmax' | 'xmin' | 'ymax' | 'ymin', number>>;
};

type DiseasesResponse = RecommendationsProps & {
	health_rate: number;
	illness_list: string[];
};

const prefixUrl = 'https://strawberry.ktsd.cc/api/';

const postData = async <T extends Record<string | number, unknown>>(method: string, buffer: ArrayBuffer, mime: string): Promise<T> => {
	const form = new FormData();
	const blob = new Blob([buffer], {
		type: mime,
	});

	form.append('image', blob, 'image.jpg');

	const response = await ky(method, {
		prefixUrl,
		method: 'POST',
		body: form,
		timeout: 60000,
	}).json() as T;

	for (const key in Object.keys(response)) {
		if (key.toLowerCase().endsWith('url') && typeof response[key] === 'string') {
			response[key] = prefixUrl + String(response[key]).slice(1);
		}
	}

	return response;
};

const downloadImageToBuffer = async (url: string): Promise<ArrayBuffer> => {
	return await ky(url.startsWith('/') ? url.slice(1) : url, {
		prefixUrl,
	}).arrayBuffer();
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file, setPreview }) => {
	const [stage, setStage] = useState<Stages>(Stages.BBoxes);
	const [images, setImages] = useState<[ArrayBuffer?, ArrayBuffer?]>([]);
	const [rawData, setRawData] = useState<BBoxesResponse & Partial<DiseasesResponse> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const source = await file.arrayBuffer();
				setImages([source]);

				const bboxes = await postData<BBoxesResponse>('predictStrawberriesBoundingBoxes', source, file.type);
				const detection = await downloadImageToBuffer(bboxes.renderedImgUrl);

				setRawData(bboxes);
				setImages([detection]);
				setStage(Stages.HealthCheck);

				const vibeCheck = await postData<DiseasesResponse>('predictPlantDiseases', source, file.type);

				// let's assume that this is segmentation
				const segmentation = await downloadImageToBuffer(bboxes.imgUrl);

				setRawData({ ...bboxes, ...vibeCheck });
				setImages([detection, segmentation]);
				setStage(Stages.Done);
			}
			catch (e) {
				console.error(e);
				setError(e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error');
			}
		})();
	}, [file]);

	return (
		<Grid.Container gap={2} className={styles.entity}>
			<Grid xs={6}>
				<Preview
					main={images[0]}
					secondary={images[1]}
				/>
			</Grid>
			<Grid xs={18}>
				<Grid.Container gap={1}>
					<Grid xs={12}>
						<div className={styles.column}>
							<Description title='Статус обработки' content={
								<Steps
									index={stage}
									error={error}
									steps={[
										{
											label: 'Детекция клубники',
										},
										{
											label: 'Оценка здоровья куста',
										},
									]}
								/>
							} />

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
						</div>
					</Grid>

					<Grid xs={12}>
						<div className={styles.column}>
							<Description
								title='Уровень здоровья'
								content={rawData?.health_rate ? (
									<Text b>{rawData.health_rate.toFixed(1)} %</Text>
								) : (
									<Spinner />
								)}
							/>

							<Description title='Сырые данные с сервера' content={rawData ? <DataTree data={rawData} /> : <Spinner />} />
						</div>
					</Grid>
				</Grid.Container>
			</Grid>
		</Grid.Container>
	);
};
