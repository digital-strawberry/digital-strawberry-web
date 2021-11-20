import React, { useMemo } from 'react';
import { Tree } from '@geist-ui/react';
import { convert, DataNode } from './convert';
import styles from './DataTree.module.scss';

export type { DataNode };

export type DataTreeProps = {
	data: DataNode;
};

export const DataTree: React.FC<DataTreeProps> = ({ data }) => {
	const tree = useMemo(() => convert(data), [data]);

	return (
		<div className={styles.tree}>
			<Tree value={tree} />
		</div>
	);
};
