import { fromFauna, fromIndex } from "@owl-factory/database/conversion/fauna/from";
import { toFauna, toRef } from "@owl-factory/database/conversion/fauna/to";
import { FaunaDocument, FaunaIndexOptions, FaunaIndexResponse } from "@owl-factory/database/types/fauna";
import { Ref64 } from "@owl-factory/types";
import { normalize } from "@owl-factory/utilities/strings";
import { Expr, query as q } from "faunadb";
import { FaunaIndex, FaunaIndexTerms } from "fauna"; // TODO - refactor and remove this
import { getServerClient } from "../client/fauna";

/**
 * Creates a single document in the Fauna database
 * @param collection The collection to insert the document into
 * @param doc The Javascript object document to place into the database
 * @returns The created document
 */
export async function createOne<T>(collection: string, doc: Record<string, unknown>): Promise<T | undefined>{
  const client = getServerClient();
  delete doc.ref;
  const faunaDoc: FaunaDocument = toFauna(doc);

  const faunaResult: FaunaDocument = await client.query(q.Create(collection, faunaDoc));

  // TODO - how are errors thrown from fauna
  const parsedResult = fromFauna(faunaResult);
  return parsedResult as unknown as T;
}

/**
 * Deletes a single document from the database
 * @param id The ref64 ID to convert into a proper reference
 * @returns The deleted document
 */
export async function deleteOne<T>(id: Ref64): Promise<T | undefined> {
  const client = getServerClient();
  const ref = toRef(id);

  const faunaResult: FaunaDocument = await client.query(q.Delete(ref));
  const parsedDoc = fromFauna(faunaResult);
  // return parsedDoc;
  return parsedDoc as unknown as T;
}

/**
 * Finds a document in fauna by a given ID and returns it (if any) in a usable JS object
 * @param id The ref64 ID to convert into a proper reference
 */
export async function findByID<T>(id: string): Promise<T | undefined> {
  const ref = toRef(id);
  const client = getServerClient();
  const doc: FaunaDocument | null = await client.query(q.Get(ref));

  if (!doc) { return undefined; }
  const parsedDoc = fromFauna(doc);
  return parsedDoc as unknown as T;
}

/**
 * Finds and returns many documents by their IDs
 * @param ids An array of Ref64 ids of documents to fetch
 * @returns A list of documents
 */
export async function findManyByIDs<T>(ids: Ref64[]): Promise<T[]> {
  if (ids === undefined) { return []; }

  const docs: Promise<T>[] = [];
  ids.forEach((id: Ref64) => {
    if (!id) { return; }
    const doc = findByID<T>(id);
    if (!doc) { return; }

    docs.push(doc as Promise<T>);
  });

  return Promise.all(docs);
}

/**
 * Searches by a specified index
 * TODO - unlink from fauna index or have a way to set that
 * @param index The FaunaIndex to search
 * @param terms The terms that are being searched
 * @param options Any options that may modify the search
 * @returns An array of documents found by the search
 */
export async function searchByIndex<T>(
  index: FaunaIndex, terms: (string | boolean | Expr)[], options?: FaunaIndexOptions
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
  const docs = fromIndex(result.data, FaunaIndexTerms[index]);
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
  const ref = toRef(id);
  const patchDoc = toFauna(doc);

  const result: FaunaDocument = await client.query(q.Update(ref, patchDoc));

  if (!result) {
    throw "An error occured while updating a document";
  }

  const parsedResult = fromFauna(result);
  return parsedResult as unknown as T;
}

/**
 * Signs a user in through Fauna and returns the user
 * @param index The index to use for searching for the user
 * @param username The username or any other unique value for the user, like email
 * @param password The user's password
 * @returns The signed in user, if found. Throws an error otherwise
 */
export async function signIn<T>(index: string, username: string, password: string): Promise<T> {
  const client = getServerClient();
  let loginResult: any;
  try {
    loginResult = await client.query(
      q.Login(
        q.Match(q.Index(index), normalize(username)), { password },
      )
    );
  } catch (e) {
    throw({ code: 401, message: "The user was not found or the password was incorrect." });
  }

  const user: FaunaDocument = await client.query(q.Get(loginResult.instance));
  const parsedUser = fromFauna(user);
  return parsedUser as any as T;
}

/**
 * Signs out the current user from the Fauna client
 * TODO - review. This basically does nothing, yeah?
 */
export function signOut() {
  const client = getServerClient();

  try {
    client.query(q.Logout(false));
  } catch (e) {
    console.log(e);
    throw ({code: 500, message: "An unknown error occured when logging out"});
  }
}

/**
 * Signs up a new user to the database. Similar to the create function, but specifically for users
 * @param collection The collection to create a new user in
 * @param user The user document to create
 * @param password The password credentials that the user will be created with
 */
export async function signUp<T>(collection: string, user: Partial<T>, password: string): Promise<T> {
  const client = getServerClient();
  const faunaUser = toFauna(user);
  faunaUser.credentials = { password };

  // Try-Catch handles failures for whatever reason
  // TODO - can we have better validation?
  let createdUser: FaunaDocument;
  try {
    createdUser = await client.query(q.Create(collection, faunaUser));
  } catch (e) {
    console.log(e)
    throw({ code: 405, message: "User could not be created" });
  }

  const parsedUser = fromFauna(createdUser);
  return parsedUser as unknown as T;
}
