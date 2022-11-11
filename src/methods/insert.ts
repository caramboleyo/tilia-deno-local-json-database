import { writeFile } from '../storage.ts';
import type { DataObject, MaybeArray } from '../types.ts';

export default async (filename: string, data: MaybeArray<DataObject>) => {
	if (Array.isArray(data)) {
		data.forEach(async o => {
			o._id = o._id || crypto.randomUUID();
			await writeFile(filename, o);
		});
	} else {
		data._id = data._id || crypto.randomUUID();
		await writeFile(filename, data);
	}
	return data;
};
