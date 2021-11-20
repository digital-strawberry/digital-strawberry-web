import React from 'react';
import styles from './Recommendations.module.scss';

export type RecommendationsProps = {
	recommendations: Array<{
		type: 'air-hi' | 'azot-lo' | 'chem' | 'hum-lo' | 'insects' | 'light-hi' | 'temp-hi' | 'temp-lo' | 'water-hi' | 'weed';
		description: string;
	}>
};

const getIconByRecommendationType = (type: RecommendationsProps['recommendations'][number]['type']): string => {
	switch (type) {
		case 'air-hi':
			return 'air';
		case 'azot-lo':
			return 'grass';
		case 'chem':
			return 'science';
		case 'hum-lo':
			return 'water_drop';
		case 'insects':
			return 'pest_control';
		case 'light-hi':
			return 'tungsten';
		case 'temp-hi':
			return 'thermostat';
		case 'temp-lo':
			return 'ac_unit';
		case 'water-hi':
			return 'water';
		case 'weed':
			return 'grass';
	}
};

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
	return (
		<div className={styles.list}>
			{recommendations.map(({ type, description }, index) => (
				<div key={index} className={styles.node}>
					<span className='material-icons'>
						{getIconByRecommendationType(type)}
					</span>
					<div>
						{description}
					</div>
				</div>
			))}
		</div>
	);
};
