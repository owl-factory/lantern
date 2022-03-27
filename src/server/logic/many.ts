import { Ref64 } from "@owl-factory/types";

/**
 * Creates many documents
 * @param fx The function to run for many creations
 * @param docs The list of partial documents to create
 */
export async function createMany<T>(fx: (doc: Partial<T>) => Promise<Partial<T>>, docs: Partial<T>[]) {
  const promises: Promise<Partial<T>>[] = [];

  docs.forEach((doc: Partial<T>) => {
    if (fx === undefined) { return; }
    const promise = fx(doc);
    promises.push(promise);
  });

  const createdDocs = await Promise.all(promises);
  return createdDocs;
}

/**
 * Returns a list of deleted documents
 * @param fx The function to run for many deletions
 * @param refs The list of refs of the documents to delete
 */
export async function deleteMany<T>(
  fx: (ref: Ref64) => Promise<T>,
  refs: Ref64[]
): Promise<Partial<T>[]> {
  const promises: Promise<Partial<T>>[] = [];
  refs.forEach((ref: Ref64) => {
    if (fx === undefined) { return; }
    promises.push(fx(ref));
  });
  const deletedDocs = Promise.all(promises);
  return deletedDocs;
}

/**
 * Returns a list of documents
 * @param fx The function to run for finding each document
 * @param refs The list of refs of the documents to find
 */
export async function fetchMany<T>(
  fx: (ref: Ref64) => Promise<Partial<T>>,
  refs: Ref64[]
): Promise<Partial<T>[]> {
  const promises: Promise<Partial<T>>[] = [];
  if (!refs || !fx) { return []; }

  for (const ref of refs) {
    if (fx === undefined) { continue; }
    promises.push(fx(ref));
  }
  const fetchedDocs = Promise.all(promises);
  return fetchedDocs;
}

/**
 * Updates a collection of documents
 * @param fx The function to run for finding each document
 * @param refs The list of refs of the documents to find
 */
export async function updateMany<T>(
  fx: (ref: Ref64, doc: Partial<T>) => Promise<Partial<T>>,
  packets: UpdatePacket<T>[]
): Promise<Partial<T>[]> {
  const promises: Promise<Partial<T>>[] = [];
  packets.forEach((packet: UpdatePacket<T>) => {
    if (fx === undefined) { return; }
    promises.push(fx(packet.ref, packet.doc));
  });
  const deletedDocs = Promise.all(promises);
  return deletedDocs;
}

interface UpdatePacket<T> {
  ref: Ref64;
  doc: Partial<T>;
}
