import Collection from '../src/collection.ts';

//let collection: Collection<{ [key: string]: any }>;
let collection: Collection<{ name: string }>;

Deno.test('Creating collection', () => {
	return new Promise(res => {
		collection = new Collection({
			filename: './test_collection.json.collection',
			autoload: true,
		});
		collection.on('load', () => res());
	});
});

Deno.test('Inserting One Document', async () => {
	await collection.insert({ name: 'Matthiew' });
});

Deno.test('Inserting Multiple Documents', async () => {
	await collection.insert([{ name: 'Olivia' }, { name: 'Peter' }]);
});

Deno.test('Updating multiple Documents', async () => {
	await collection.update(
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
	await collection.find({ name: 'Denyn' });
});

Deno.test('Removing multiple documents', async () => {
	await collection.remove({ name: 'Denyn' });
});

Deno.test('Inserting one Document', async () => {
	await collection.insert({ name: 'denyn' });
});

Deno.test('Updating one Document', async () => {
	await collection.updateOne(
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
	await collection.findOne({ name: 'Denyn' });
});

Deno.test('Removing one Document', async () => {
	await collection.removeOne({ name: 'Denyn' });
});
