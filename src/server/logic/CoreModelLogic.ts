import { getServerClient } from "utilities/db";
import { Expr, query as q } from "faunadb";
import { fromFauna, isFaunaError, parseFaunaRef, toFauna, toFaunaDate, toFaunaRef } from "utilities/fauna";
import { FaunaRef } from "types/fauna";
import { AnyDocument } from "types/documents";

interface PaginationOptions {
  size: number;
}

interface IndexResponse {
  data?: (string | number | unknown)[][];
  error?: any;
}

interface IdCollectionRef {
  id: string;
  collection: string;
}

interface RefRef {
  ref: FaunaRef;
}

export type DocumentReference = IdCollectionRef |& RefRef;

export interface MyUserDocument {
  id: string,
  ref: FaunaRef,
  roles: string[];
}

/**
 * Fetches a document by reference and converts it into a JS object.
 * @param ref A reference document
 */
export async function fetchByRef(ref: DocumentReference): Promise<AnyDocument | null> {
  const client = getServerClient();

  const faunaRef = toFaunaRef(ref);
  const result = await client.query(q.Get(faunaRef)) as Record<string, unknown>;
  if (result === null) { return result; }
  return fromFauna(result);
}

/**
 * Handles the shared code for fetching by an index and putting into documents
 * @param searchIndex The index to search through
 * @param terms The terms in order of usage encapsulated in an array
 * @param values The field names of the values, in the order they are returned
 * @param paginationOptions Options for paginaton, such as size
 */
export async function fetchByIndex(
  searchIndex: string,
  terms: (string | Expr)[],
  values: string[],
  paginationOptions: PaginationOptions
): Promise<AnyDocument[]> {
  const client = getServerClient();

  const result: IndexResponse = await client.query(
    q.Paginate(
      q.Match(q.Index(searchIndex), terms),
      paginationOptions
    ),
  );

  // TODO - proper error message
  if (!result.data || isFaunaError(result)) {
    throw `An error occured while attempting to search the ${searchIndex} index`;
  }

  const parsedResult: any[] = [];
  // TODO - move parsing index to fromFauna?
  result.data.forEach((item: (string | number | unknown)[]) => {
    const parsedItem: Record<string, unknown> = {};

    // If there are no terms, the only value returned is a Ref object
    if (!Array.isArray(item)) {
      const { id, collection } = parseFaunaRef(item);
      parsedItem.ref = item;
      parsedItem.id = id;
      parsedItem.collection = collection;
    } else {
      // For each item, there is a term given that maps it
      // The end result should resemble a mapped object
      item.forEach((value: (string | number | unknown), index: number) => {
        const valueKey = values[index];
        parsedItem[valueKey] = value;

        if(valueKey === "ref") {
          const { id, collection } = parseFaunaRef(value);
          parsedItem.id = id;
          parsedItem.collection = collection;
        }
      });
    }
    parsedResult.push(parsedItem);
  });

  return parsedResult;
}

/**
 * Creates a single document
 * @param collection The collection to save a new document to
 * @param doc The raw Javascript-style document to save to the database
 * @param allowedFields The fields that we are allowing to be saved
 * @param myUser The current user who is creating the document
 */
export async function createOne(
  collection: string,
  doc: AnyDocument,
  allowedFields: string[],
  myUser: MyUserDocument,
): Promise<AnyDocument> {

  const faunaDoc = toFauna(trimRestrictedFields(doc as Record<string, unknown>, allowedFields));
  const now = toFaunaDate(new Date());
  const currentUser = { ref: myUser.ref };

  faunaDoc.data.createdAt = now;
  faunaDoc.data.updatedAt = now;
  faunaDoc.data.ownedBy = currentUser;
  faunaDoc.data.createdBy = currentUser;
  faunaDoc.data.updatedBy = currentUser;

  const client = getServerClient();
  const result = await client.query(
    q.Create(collection, doc)
  ) as Record<string, unknown>;

  if (isFaunaError(result)) {
    throw { code: 500, status: "An error occurred while creating your document" };
  }

  return fromFauna(result);
}

/**
 * Updates a single document in fauna
 * @param refDoc The reference to the document to update
 * @param doc The fields to update. Present but null fields will be deleted
 * @param allowedFields The fields allowed to save. All others will be discarded
 * @param myUser The current user object
 */
export async function updateOne(
  refDoc: DocumentReference,
  doc: Record<string, unknown>,
  allowedFields: string[],
  myUser: MyUserDocument
): Promise<AnyDocument> {
  const client = getServerClient();

  const faunaDoc = toFauna(trimRestrictedFields(doc, allowedFields));
  const ref = toFaunaRef(refDoc);
  const now = toFaunaDate(new Date());
  const currentUser = { ref: myUser.ref };

  delete faunaDoc.ref;

  faunaDoc.data.updatedAt = now;
  faunaDoc.data.updatedBy = currentUser;

  const result = await client.query(q.Update(ref, faunaDoc)) as Record<string, unknown>;
  if (isFaunaError(result)) {
    throw { code: "500", message: "An error occured while updating the document" };
  }
  return fromFauna(result);
}

/**
 * Deletes a single document, if present. Returns the deleted document if successful, null if no document was found
 * @param docRef The reference to a document
 */
 export async function deleteOne(docRef: DocumentReference): Promise<AnyDocument | null> {
  const client = getServerClient();
  const ref = toFaunaRef(docRef);
  const result = await client.query(q.Delete(ref)) as Record<string, unknown>;
  if (isFaunaError(result)) {
    return null;
  }

  return fromFauna(result);
}

/**
 * Trims the given document to only have the given fields. All others are discarded.
 * TODO - refactor this so that multiple layers are allowed
 * TODO - move this to a more appropriate area
 * @param doc The document to trim
 * @param givenAllowedFields The given fields to keep, if any
 */
export function trimRestrictedFields(
  doc: Record<string, unknown>,
  givenAllowedFields: string[]
): Record<string, unknown> {
  const allowedFields = [
    "id", "collection", "ref", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
  ].concat(givenAllowedFields);

  const newDoc: any = {};
  allowedFields.forEach((allowedField: string) => {
    if (!(allowedField in doc)) { return; }
    newDoc[allowedField] = doc[allowedField];
  });

  return newDoc;
}

