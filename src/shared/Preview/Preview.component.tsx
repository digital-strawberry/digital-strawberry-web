import React, { useMemo, useState } from 'react';
import { Badge, Spinner } from '@geist-ui/react';
import { Buffer } from 'buffer';
import styles from './Preview.module.css';
import { prefixUrl } from 'config';

type Image = ArrayBuffer;

export type PreviewProps = {
	main?: Image;
	secondary?: Image;
};

declare global {
	interface ArrayBuffer {
		source?: string;
	}
}

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
	const href = (idx === 0 ? main : secondary)?.source?.slice(1);

	return (
		<div className={styles.wrapper}>
			<a
				target='_blank'
				rel='noreferrer'
				href={href ? prefixUrl + href : undefined}
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
							key={index}
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
