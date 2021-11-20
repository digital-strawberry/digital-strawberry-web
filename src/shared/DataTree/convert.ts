import { TreeFile } from '@geist-ui/react/dist/tree';

export type DataNode = number | string | { [key: number]: DataNode } | { [key: string]: DataNode };

export const convert = (obj: DataNode): TreeFile[] => {
	return Object.entries(obj)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]): TreeFile => {
			if (typeof value !== 'object') {
				return {
					type: 'file',
					name: key,
					extra: value,
				};
			}

			if (Array.isArray(value)) {
				return {
					type: 'directory',
					name: `${key}[]`,
					files: value.flatMap((file, index) => typeof file === 'object' ? {
						type: 'directory',
						name: index.toString(),
						files: convert(file),
					} : {
						type: 'file',
						name: file,
					}),
				};
			}

			return {
				type: 'directory',
				name: key,
				files: convert(value)
			};
		});
};
