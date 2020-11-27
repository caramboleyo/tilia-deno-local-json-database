import { mingo } from '../../deps.ts';
import { updateFile, ReadFileStream} from '../storage.ts';

export default async (filename, query) => {
  let stream = new ReadFileStream(filename);
  const queryMaker = new mingo.Query(query, {});
  let update = [];
  let removed = [];
  return new Promise((resolve, reject) => {
    stream.on('document', obj => {
      if (!queryMaker.test(obj)) update.push(obj)
      if (queryMaker.test(obj)) removed.push(obj)
    })
    stream.on('end', async () => {
      await updateFile(filename, update)
      return resolve(removed);
    })
  })
}