import { timed } from 'https://cdn.skypack.dev/@thi.ng/bench';
import Collection from '../../src/collection.ts';

const db = new Collection({ filename: './test_collection.json.db', autoload: true });

timed(async function () {
	await db.insert({ name: 'Denyn' });
}, 'Insert');

timed(async function () {
	await db.find({ name: 'Denyn' });
}, 'Find');

timed(async function () {
	await db.findOne({ name: 'Denyn' });
}, 'Find One');

timed(async function () {
	await db.update({ name: 'Denyn' }, { $set: { name: 'Juan' } });
}, 'Update');

timed(async function () {
	await db.updateOne({ name: 'Denyn' }, { $set: { name: 'Juan' } });
}, 'Update One');

timed(async function () {
	await db.removeOne({ name: 'Juan' });
}, 'Delete One');

timed(async function () {
	await db.remove({ name: 'Juan' });
}, 'Delete');
