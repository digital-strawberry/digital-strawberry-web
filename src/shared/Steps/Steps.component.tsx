import React from 'react';
import { Dot, Spinner } from '@geist-ui/react';
import styles from './Steps.module.scss';

export type StepsProps = {
	index: number;
	steps: Array<{
		label: string;
		comment?: string;
	}>;
};

export const Steps: React.FC<StepsProps> = ({ index, steps }) => {
	return (
		<div className={styles.container}>
			{steps.map(({ label, comment }, idx) => (
				<>
					<div className={styles.loading}>
						<div className={styles.indicator}>
							{idx === index ? <Spinner /> : idx < index ? <Dot type='success' /> : <Dot />}
						</div>

						<span className={idx > index ? styles.future : idx < index ? styles.past : ''}>
							{label}
						</span>
					</div>
					{idx < index && <div className={styles.description}>{comment}</div>}
				</>
			))}
		</div>
	);
};
