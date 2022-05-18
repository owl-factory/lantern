import { Ref64 } from "@owl-factory/types";
import { CrudPacket } from "@owl-factory/types/object";
import { BaseDocument } from "types/documents";

/**
 * Creates many documents
 * @param fx The function to run for many creations
 * @param docs The list of partial documents to create
 */
export async function createMany<T>(fx: (doc: Partial<T>) => Promise<Partial<T>>, docs: Partial<T>[]) {
  const promises: Promise<CrudPacket<Partial<T>>>[] = [];

  docs.forEach((doc: Partial<T>) => {
    if (fx === undefined) { return; }
    const promise = packetWrapper(() => fx(doc));
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
): Promise<CrudPacket<Partial<T>>[]> {
  const promises: Promise<CrudPacket<Partial<T>>>[] = [];
  for (const ref of refs) {
    if (fx === undefined) { continue; }
    promises.push(packetWrapper(() => fx(ref), { ref }));
  }
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
): Promise<CrudPacket<Partial<T>>[]> {
  const promises: Promise<CrudPacket<Partial<T>>>[] = [];
  if (!refs || !fx) { return []; }

  for (const ref of refs) {
    if (fx === undefined) { continue; }
    promises.push(packetWrapper(() => fx(ref)));
  }
  const fetchedDocs = Promise.all(promises);
  return fetchedDocs;
}

/**
 * Updates a collection of documents
 * @param fx The function to run for finding each document
 * @param refs The list of refs of the documents to find
 */
export async function updateMany<T extends BaseDocument>(
  fx: (ref: Ref64, doc: Partial<T>) => Promise<Partial<T>>,
  docs: Partial<T>[]
): Promise<CrudPacket<Partial<T>>[]> {
  const promises: Promise<CrudPacket<Partial<T>>>[] = [];
  if (fx === undefined) { return []; }

  for (const doc of docs) {
    if (!doc.ref) { continue; }
    const ref = doc.ref;
    promises.push(packetWrapper(() => fx(ref, doc), { ref: doc.ref }));
  }

  const deletedDocs = Promise.all(promises);
  return deletedDocs;
}

interface UpdatePacket<T> {
  ref: Ref64;
  doc: Partial<T>;
}

async function packetWrapper(fx: Function, basePacket?: Partial<CrudPacket<any>>) {
  const packet: CrudPacket<any> = { ...basePacket, success: false, messages: [] };
  try {
    packet.doc = await fx();
    packet.success = true;
  } catch (e) {
    packet.doc = undefined;
    packet.success = false;
    packet.messages = returnArr(e as (string | string[]));
  }

  return packet;
}

function returnArr(data: any) {
  if (typeof data === "string") { return [data]; }
  else if (Array.isArray(data)) { return data; }
  else if (typeof data === "object") { return [ data.message ]; }
  return ["unknown error"];
}
