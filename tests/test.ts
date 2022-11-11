import Collection from '../src/collection.ts';

let db: Collection<{ name: string }>;

Deno.test('Creating collection', () => {
	return new Promise(res => {
		db = new Collection({ filename: './test_collection.json.db', autoload: true });
		db.on('load', () => res());
	});
});

Deno.test('Inserting Multiple Documents', async () => {
	await db.insert({ name: 'denyn' }, { name: 'denyn' });
});

Deno.test('Updating multiple Documents', async () => {
	await db.update(
		{
			name: 'denyn',
		},
		{
			$set: {
				name: 'Denyn',
			},
		}
	);
});

Deno.test('Finding multiple with await', async () => {
	await db.find({ name: 'Denyn' });
});

Deno.test('Finding multiple with callback', () => {
	return new Promise(res => {
		db.find({ name: 'Denyn' }, {}, () => {
			res();
		});
	});
});

Deno.test('Removing multiple documents', async () => {
	await db.remove({ name: 'Denyn' });
});

Deno.test('Inserting one Document', async () => {
	await db.insert({ name: 'denyn' });
});

Deno.test('Updating one Document', async () => {
	await db.updateOne(
		{
			name: 'denyn',
		},
		{
			$set: {
				name: 'Denyn',
			},
		}
	);
});

Deno.test('Finding one Document', async () => {
	await db.findOne({ name: 'Denyn' });
});

Deno.test('Removing one Document', async () => {
	await db.removeOne({ name: 'Denyn' });
});
