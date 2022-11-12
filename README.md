# Tilia - local json database for deno

With Tilia you can store and query JSON objects in local files with Deno. Like in mongoDB we call such objects “documents”. Those documents are stored in collections. A collection is simply a file where every line is one document - meaning a JSON object you stored.

Unless other libs around we do not load the complete collection file into memory. Instead we use file streams to only store a portion of the file in memory at the same time and therefore consume less resources (RAM).

Tilia is a fork and rewrite of [DnDB](https://github.com/denyncrawford/dndb).

Not yet:

-   indexes for faster queries
-   count, limit
-   line position index to fetch data without looping
-   splitting of large files

## Usage

Tilia works by instantiating collections stored in a file given by the user in the instance constructor. By default the created instance exposes the necessary methods to work the collection.

All the api methods are asynchronous by default, so they return promises.

## Collection

```javascript
import Collection from 'https://deno.land/x/tilia/src/collection.ts';

const collection = new Collection({ filename: './collection.json.db', autoload: true });
```

When you instantiate a collection you can pass it a config object with a couple
of options:

`filename`: The filename is the absolute path to your target file. If no
filename is provided, DnDB will automatically create one in the current
working directory, and if a full path is not specified, it will resolve the
file name within the CWD.

`autoload`: The autoload option runs the `loadDatabase` method which creates
the persistent file the first time DnDB is running in your project, this is
optional, but if the loadDatabase method is not executed, the instance will
not work until the persistent file exists.

`bufSize`: The bufSize parameter rewrites the default size of the buffer. It
must be indicated in numbers and represents the amount of bytes to be
allocated. By default 4096 bytes.

## Insert

All data types are allowed, but field names starting with '$' are reserved for
data querying.

If the document does not already contain an `_id` field, it will be automatically generated. The `_id` of a document, once set, shouldn't be modified.

```javascript
const obj = {
	name: 'Denyn',
	lastName: 'Crawford',
};

const inserted = await collection.insert(obj);
```

### Paramaters

**data**: `Object | Array<Object>` JSON object or array of objects

```javascript
const foo = 'foo';
const inserted = await collection.insert([{ name: 'denyn' }, { name: foo }]);
```

### Return

Array/object with the inserted object or array of objects.

## Find

There are two methods to query the database:

`find`: Finds all the documents that match the query and returns an array of matching documents.

`findOne`: Finds the first document that matches the query and returns exact first matching object.

You can select documents based on field equality or use comparison operators
(`$lt`, `$lte`, `$gt`, `$gte`, `$in`, `$nin`, `$neq`). You can also use logical
operators `$or`, `$and`, `$not` and `$eq`.
🔗 [List of rules and operators](https://github.com/kofrasa/mingo/blob/master/README.md)

You can use regular expressions in two ways: in basic querying in place of a
string, or with the $regex operator.

```javascript
const docs = await collection.find({ name: 'Denyn' });
```

Finding unique document:

```javascript
const doc = await collection.findOne({ username: 'denyncrawford' });
```

Deep querying syntax:

```javascript
const docs = await collection.find({ fullName: { lastName: 'Crawford' } });
```

You can also use dot notation to find documents by deep querying.

```javascript
let docs = await collection.find({ 'fullName.lastName': 'Crawford' });
```

Using dot notation to find inside arrays:

```javascript
let docs = await collection.find({ 'list.games.0': 'Doom' });
```

### Projection

You can give `find` and `findOne` an optional second argument, projections. The
syntax is the same as MongoDB: `{ a: 1, b: 1 }` to return only the a and b
fields, `{ a: 0, b: 0 }` to omit these two fields. You cannot use both modes at
the time, except for \_id which is by default always returned and which you can
choose to omit. You can project on nested documents. 🔗 [List of rules and operators](https://github.com/kofrasa/mingo/blob/master/README.md)

```javascript
const docs = await collection.find({ planet: 'Mars' }, { planet: 1, system: 1 });
// docs is [{ planet: 'Mars', system: 'solar', _id: '45fb71a3-531a-4285-88c6-45db802a0a95' }]
```

## Update

There are two methods to update documents:

`update` - returns array with the new updated collection
`updateOne` - returns object with the new updated document

### Parameters

The first argument follows the same query rules as `find` and `findOne`. The second agument modifies the matching field values by following aggregation operators. 🔗 [List of rules and operators](https://github.com/kofrasa/mingo/blob/master/README.md).

```javascript
const updated = await collection.update(
	{ name: 'denyn' },
	{
		$set: { pet: 'Boots' },
	}
);
```

## Remove

To delete documents DnDB exposes the method:

`remove` - returns array with the new removed collection

`removeOne` - returns object with the new removed document

The remove method follows the same query rules as in `find` and `findOne` at
first argument, it will remove all the documents that matches the query.

```javascript
const removed = await collection.remove({ _id: 'id2' });
```

> **Notice**: If you dont want to delete but just unset one property of a document you need to use update with the $unset operator. 🔗 [List of rules and operators](https://github.com/kofrasa/mingo/blob/master/README.md).

## Test & Benchmark

There are **very** basic tests and a benchmark to demonstrate how you _could_ do that.

Run tests in console:
```javascript
$ deno test -A
```

Run benchmark from console:
```javascript
$ deno run -A ./tests/benchmarks/find.js
```