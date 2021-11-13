import { fromFauna, parseIndexResponse } from "database/conversion/fauna/from";
import { toFauna } from "database/conversion/fauna/to";
import { Expr, query as q } from "faunadb";
import { parse } from "path";
import { Ref64 } from "types";
import { AnyDocument } from "types/documents";
import { FaunaDocument, FaunaIndexOptions, FaunaIndexResponse } from "types/fauna";
import { getClient, getServerClient } from "utilities/db";
import { decode } from "utilities/encoding";

// Defines an ID placed into our custom Ref64 format
enum Collection {

}

// TODO - move these
export enum FaunaIndex {
  CampaignsByUser="my_campaigns_asc",
}
export const FaunaIndexTerms = {
  [FaunaIndex.CampaignsByUser]: ["lastPlayedAt", "ref", "name", "banner.src"],
};

/**
 * Converts a ref64 ID back into a Fauna ref
 * @param ref64ID The Ref64 ID to convert into the original fauna ref.
 * @returns A Fauna Ref expr.
 */
export function idToRef(ref64ID: Ref64): Expr {
  const { id, collection } = decode(ref64ID);
  const ref = q.Ref(q.Collection(collection as string), id);
  return ref;
}

/**
 * Creates a single document in the Fauna database
 * @param collection The collection to insert the document into
 * @param doc The Javascript object document to place into the database
 * @returns The created document
 */
export async function createOne(collection: Collection, doc: Record<string, unknown>): Promise<AnyDocument>{
  const client = getServerClient();
  const faunaDoc: FaunaDocument<unknown> = toFauna(doc);

  const faunaResult = await client.query(q.Create(collection, faunaDoc)) as Record<string, unknown>;

  // TODO - how are errors thrown from fauna
  const parsedResult = fromFauna(faunaResult);
  return parsedResult;
}

/**
 * Deletes a single document from the database
 * @param id The ref64 ID to convert into a proper reference
 * @returns The deleted document
 */
export async function deleteOne<T>(id: Ref64): Promise<T | undefined> {
  const client = getServerClient();
  const ref = idToRef(id);

  const faunaResult = await client.query(q.Delete(ref));
  // const parsedDoc = fromFauna(faunaResult as Record<string, unknown>);
  console.log(faunaResult);
  // return parsedDoc;
  return faunaResult as any;
}

/**
 * Finds a document in fauna by a given ID and returns it (if any) in a usable JS object
 * @param id The ref64 ID to convert into a proper reference
 */
export async function findByID<T>(id: string): Promise<T | undefined> {
  const ref = idToRef(id);
  const client = getServerClient();
  const doc: FaunaDocument<unknown> | null = await client.query(q.Get(ref));

  if (!doc) { return undefined; }
  const parsedDoc = fromFauna(doc as Record<string, unknown>);
  return parsedDoc as unknown as T;
}

/**
 * Finds and returns many documents by their IDs
 * @param ids An array of Ref64 ids of documents to fetch
 * @returns A list of documents
 */
export async function findManyByIDs<T>(ids: Ref64[]): Promise<T[]> {
  const docs: Promise<T>[] = [];
  ids.forEach((id: Ref64) => {

    const doc = findByID<T>(id);
    if (!doc) { return; }

    docs.push(doc as Promise<T>);
  });

  return Promise.all(docs);
}

/**
 * Searches by a specified index
 * @param index The FaunaIndex to search
 * @param terms The terms that are being searched
 * @param options Any options that may modify the search
 * @returns An array of documents found by the search
 */
export async function searchByIndex<T>(
  index: FaunaIndex, terms: (string | Expr)[], options?: FaunaIndexOptions
): Promise<T[]> {
  const client = getServerClient();

  // Queries the given index. This is automatically set up for pagination
  const result: FaunaIndexResponse = await client.query(
    q.Paginate(
      q.Match(q.Index(index), terms),
      options
    ),
  );

  // Handles invalid results
  if (!result.data) {
    throw { code: 500, message: `An error occured while trying to search the ${index} index` };
  }
  const docs = parseIndexResponse(result.data, FaunaIndexTerms[index]);
  return docs as unknown as T[];
}

/**
 * Updates a single document in the database
 * @param id The ref64 ID of the document to update
 * @param doc The partial document to update in the database
 * @returns The fully updated document
 */
export async function updateOne<T>(id: Ref64, doc: Partial<T>): Promise<T> {
  const client = getServerClient();
  const ref = idToRef(id);
  const patchDoc = toFauna(doc);

  const result: Record<string, unknown> = await client.query(q.Update(ref, patchDoc));

  if (!result) {
    throw "An error occured while updating a document";
  }

  const parsedResult = fromFauna(result);
  return parsedResult as unknown as T;
}
