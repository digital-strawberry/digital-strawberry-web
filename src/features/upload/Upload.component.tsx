import React, { useCallback, useState } from 'react';
import { Card, Text } from '@geist-ui/react';
import { Image } from '@geist-ui/react-icons';
import { useDropzone } from 'react-dropzone';
import { ImageEntity } from './ImageEntity';
import styles from './Upload.module.css';

export type UploadProps = Record<never, string>;

export const Upload: React.FC<UploadProps> = () => {
	const [files, setFiles] = useState<JSX.Element[]>([]);
	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(files => [...files, ...acceptedFiles.map(file => <ImageEntity file={file} key={file.name} />)])
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/*',
		onDrop,
	});

	return (
		<div>
			<div {...getRootProps()}>
				<Card hoverable className={isDragActive ? `${styles.card} ${styles.active}` : styles.card}>
					<div className={styles.wrapper}>
						<input {...getInputProps()} />
						<Image size={48} />
						<Text b>Перетащите картинки для анализа</Text>
						<Text span font={'12px'} type='secondary'>
							Или нажмите здесь для выбора...
						</Text>
					</div>
				</Card>
			</div>

			{files}
		</div>
	);
};
