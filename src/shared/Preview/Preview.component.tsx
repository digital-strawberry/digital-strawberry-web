import React, { useMemo, useState } from 'react';
import { Badge, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './Preview.module.css';

type Image = ArrayBuffer | string;

export type PreviewProps = {
	main?: Image;
	secondary?: Image;
};

const bufferToBase64 = (image?: Image): string | null => {
	if (image instanceof ArrayBuffer) {
		const buffer = Buffer.from(image);
		return `data:image/jpeg;base64,${buffer.toString('base64')}`;
	}

	return image ?? null;
};

export const Preview: React.FC<PreviewProps> = ({ main, secondary }) => {
	const [idx, setIdx] = useState<number>(0);
	const mainUrl = useMemo(() => bufferToBase64(main), [main]);
	const secondaryUrl = useMemo(() => bufferToBase64(secondary), [secondary]);
	const selected = (idx === 0 ? mainUrl : secondaryUrl) ?? undefined;

	return (
		<div className={styles.wrapper}>
			<a
				target='_blank'
				href={selected}
				className={styles.wrapper}
			>
				<div
					className={styles.spinner}
					style={{ backgroundImage: selected ? `url('${selected}')` : undefined }}
				>
					{selected ? null : <Spinner scale={2} />}
				</div>
			</a>

			{secondary && (
				<div className={styles.badges}>
					{['Detection', 'Segmentation'].map((key, index) => (
						<Badge
							type='success'
							style={{ backgroundColor: idx === index ? undefined : 'transparent' }}
							onClick={() => setIdx(index)}
						>
							{key}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
