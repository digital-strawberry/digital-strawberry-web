import React, { useCallback, useState } from 'react';
import { Card, Modal, Text } from '@geist-ui/react';
import { useDropzone } from 'react-dropzone';
import { ImageEntity } from './ImageEntity';
import styles from './Upload.module.css';

export type UploadProps = Record<never, string>;

export const Upload: React.FC<UploadProps> = () => {
	const [files, setFiles] = useState<JSX.Element[]>([]);
	const [previewUrl, setUrlPreview] = useState<string | null>(null);
	const [visible, setVisible] = useState<boolean>(false);

	const setPreview = useCallback((url: string) => {
		setUrlPreview(url);
		setVisible(true);
	}, []);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(files => [
			...files,
			...acceptedFiles.map(file => <ImageEntity key={file.name} file={file} setPreview={setPreview} />),
		]);
	}, [setPreview]);

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
						<span className='material-icons md-48'>image</span>
						<Text b>Перетащите картинки для анализа</Text>
						<Text span font={'12px'} type='secondary'>
							Или нажмите здесь для выбора...
						</Text>
					</div>
				</Card>
			</div>

			{files}

			<Modal width='720px' visible={visible} onClose={() => setVisible(false)}>
				<Modal.Content>
					{previewUrl && <img src={previewUrl} width='100%' alt='strawberry' />}
				</Modal.Content>
				<Modal.Action onClick={() => setVisible(false)}>
					Закрыть
				</Modal.Action>
			</Modal>
		</div>
	);
};
