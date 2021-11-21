import React, { useMemo } from 'react';
import { Tree, useClipboard, useToasts } from '@geist-ui/react';
import { convert, DataNode } from './convert';
import styles from './DataTree.module.scss';

export type { DataNode };

export type DataTreeProps = {
	data: DataNode;
};

export const DataTree: React.FC<DataTreeProps> = ({ data }) => {
	const { copy } = useClipboard();
	const [, setToast] = useToasts();
	const tree = useMemo(() => convert(data), [data]);

	const handleClickEvent = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!(event.target instanceof Element)) {
			return;
		}

		const value = (event.target.classList.contains('extra') ? event.target : event.target.querySelector('.extra'))?.innerHTML;

		if (!value) {
			return;
		}

		copy(value);
		setToast({
			text: 'Значение скопировано в буфер обмена.',
		});
	};

	return (
		<div className={styles.tree} onMouseUp={handleClickEvent}>
			<Tree value={tree} />
		</div>
	);
};
