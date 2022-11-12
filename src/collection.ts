import type { DataObject, DbResults, Mongobj, Projection } from './types.ts';
import insert from './methods/insert.ts';
import find from './methods/find.ts';
import findOne from './methods/findOne.ts';
import update from './methods/update.ts';
import updateOne from './methods/updateOne.ts';
import remove from './methods/remove.ts';
import removeOne from './methods/removeOne.ts';
import { init } from './storage.ts';
import type CollectionOptions from './types/collection.options.ts';
import { EventEmitter, resolve } from '../deps.ts';
import Executor from './executor.ts';

/** Represents a Collection instance. */
export default class Collection<Doc extends DataObject> extends EventEmitter {
	public filename: string;
	private bufSize?: number;
	private executor = new Executor();

	/** Builds the collection with the given options. */
	constructor({ filename, autoload, bufSize }: CollectionOptions) {
		super();
		this.filename = filename
			? resolve(Deno.cwd(), filename)
			: resolve(Deno.cwd(), './database.json');
		this.bufSize = bufSize;
		if (autoload) {
			this.loadFromFile().then(() => this.emit('load'));
		}
	}

	/** Loads the database on first load and ensures that path exists. */
	loadFromFile() {
		return init(this.filename);
	}

	/** Finds multiple matching documents. */
	async find(query: Partial<Doc>, projection: Partial<Projection<keyof Doc>> = {}) {
		const results = (await this.executor.add(find, [
			this.filename,
			query,
			projection,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Find first matching document. */
	async findOne(query: Partial<Doc>, projection: Partial<Projection<keyof Doc>> = {}) {
		const results = (await this.executor.add(findOne, [
			this.filename,
			query,
			projection,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Insert a document. */
	async insert(data: Doc | Doc[]) {
		const results = (await this.executor.add(insert, [
			this.filename,
			data,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Update multiple matching documents */
	async update(query: Partial<Doc>, operators: Mongobj<Doc>) {
		const results = (await this.executor.add(update, [
			this.filename,
			query,
			operators,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Update first matching document */
	async updateOne(query: Partial<Doc>, operators: Mongobj<Doc>) {
		const results = (await this.executor.add(updateOne, [
			this.filename,
			query,
			operators,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Remove multiple matching documents */
	async remove(query: Partial<Doc>) {
		const results = (await this.executor.add(remove, [
			this.filename,
			query,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}

	/** Remove first matching document */
	async removeOne(query: Partial<Doc>) {
		const results = (await this.executor.add(removeOne, [
			this.filename,
			query,
			this.bufSize,
		] as const)) as DbResults<Doc>;
		return results;
	}
}
