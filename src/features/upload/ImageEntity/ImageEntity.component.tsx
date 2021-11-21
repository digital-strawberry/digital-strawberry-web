import React, { useEffect, useState } from 'react';
import { Description, Grid, Spinner, Text } from '@geist-ui/react';
import ky from 'ky';
import styles from './ImageEntity.module.scss';
import { DataTree, Steps } from 'shared';
import { Recommendations, RecommendationsProps } from './Recommendations';
import { Preview } from 'shared';
import { prefixUrl } from 'config';

export type ImageEntityProps = {
	file: File;
};

enum Stages {
	BBoxes,
	ImageDownload,
	GrowCheck,
	HealthCheck,
	Done,
}

type BBoxesResponse = {
	imgUrl: string;
	bboxesImgUrl: string;
	segmentationImgUrl: string;
};

type DiseasesResponse = RecommendationsProps & {
	healthRate: number;
	illnessList: string[];
};

type GrowResponse = {
	level: string;
};

declare global {
	interface ArrayBuffer {
		source?: string;
	}
}

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
		timeout: false,
	}).json() as T;

	for (const key in Object.keys(response)) {
		if (key.toLowerCase().endsWith('url') && typeof response[key] === 'string') {
			response[key] = prefixUrl + String(response[key]).slice(1);
		}
	}

	return response;
};

const downloadImageToBuffer = async (url: string): Promise<ArrayBuffer> => {
	const buffer = await ky(url.startsWith('/') ? url.slice(1) : url, {
		prefixUrl,
	}).arrayBuffer();

	buffer.source = url;

	return buffer;
};

export const ImageEntity: React.FC<ImageEntityProps> = ({ file }) => {
	const [stage, setStage] = useState<Stages>(Stages.BBoxes);
	const [images, setImages] = useState<[ArrayBuffer?, ArrayBuffer?]>([]);
	const [rawData, setRawData] = useState<BBoxesResponse & Partial<DiseasesResponse> & Partial<GrowResponse> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const source = await file.arrayBuffer();
				setImages([source]);

				const bboxesAndSegmentation = await postData<BBoxesResponse>(
					'predictStrawberriesBoundingBoxesAndSegmentation',
					source,
					file.type
				);

				setRawData(bboxesAndSegmentation);
				setStage(Stages.ImageDownload);

				const detection = await downloadImageToBuffer(bboxesAndSegmentation.bboxesImgUrl);
				setImages([detection]);

				const segmentation = await downloadImageToBuffer(bboxesAndSegmentation.segmentationImgUrl);
				setImages([detection, segmentation]);

				setStage(Stages.GrowCheck);
				const grow = await postData<GrowResponse>('predictPlantLevel', source, file.type);
				setRawData({ ...bboxesAndSegmentation, ...grow });

				setStage(Stages.HealthCheck);
				const vibeCheck = await postData<DiseasesResponse>('predictPlantDiseases', source, file.type);
				setRawData({ ...bboxesAndSegmentation, ...grow, ...vibeCheck });
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
										'Детекция и сегментация клубники',
										'Загрузка изображений',
										'Оценка степени роста растения',
										'Оценка здоровья куста',
									]}
								/>
							} />

							<Description
								title='Рекомендации по уходу за кустом'
								content={
									rawData?.recommendations ? (
										rawData.recommendations.length
											? <Recommendations recommendations={rawData?.recommendations} />
											: <span>—</span>
									) : (
										<Spinner />
									)
								}
							/>
						</div>
					</Grid>

					<Grid xs={12}>
						<div className={styles.column}>
							<Description
								title='Уровень здоровья'
								content={rawData?.healthRate ? <Text b>{rawData.healthRate.toFixed(1)} %</Text> : <Spinner />}
							/>

							<Description
								title='Степень роста'
								content={rawData?.level ? <Text b>{rawData.level}</Text> : <Spinner />}
							/>

							<Description
								title='Сырые данные с сервера'
								content={rawData ? <DataTree data={rawData} /> : <Spinner />}
							/>
						</div>
					</Grid>
				</Grid.Container>
			</Grid>
		</Grid.Container>
	);
};
