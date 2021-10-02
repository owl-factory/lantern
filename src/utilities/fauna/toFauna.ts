import { Expr, query as q } from "faunadb";
import { DocumentReference } from "server/logic/CoreModelLogic";
import { FaunaRef } from "types/fauna";
import { parseFaunaRef } from "./fromFauna";

type AnyDocument = any;
type AnyFaunaDocument = any; // TODO - make this a proper document

/**
 * Converts a Javascript document into a Fauna document for saving to the database
 * @param doc The JS document to convert into a Fauna Document
 */
export function toFauna(doc: AnyDocument): AnyFaunaDocument {
  const faunaDoc: Record<string, unknown> = {};

  // Sets the ref
  if (doc.ref) { faunaDoc.ref = doc.ref; }
  else if (doc.id && doc.collection) { faunaDoc.ref = toFaunaRef(doc); }

  if (doc.ttl) { faunaDoc.ttl = doc.ttl; }

  faunaDoc.data = layerToFauna(doc);
  return faunaDoc;
}

function layerToFauna(doc: any, faunaDoc: any = {}) {
  // Edge case handling
  if (typeof doc !== "object") { return doc; }
  const keys = Object.keys(doc);
  keys.forEach((key: string) => {
    // Skip item if it's a special case
    if (["id", "ref", "collection", "ts", "ttl"].includes(key)) { return; }
    const data = doc[key];
    faunaDoc[key] = itemToFauna(data);
  });
  return faunaDoc;
}

/**
 * Maps a single layer of items to a fauna document. This step skip
 * @param doc The document to map
 */
function itemToFauna(item: unknown): unknown {
  // Base case. Do nothing if the item is null/undefined.
  // Do not change; the different values act different in Fauna
  if (item === null || item === undefined) {
    return item;
  }

  // Do nothing if simple type
  if (typeof item !== "object") {
    return item;
  }

  // If this is an array, loop through and parse as well
  if (Array.isArray(item)) {
    item.forEach((subItem: unknown, index: number) => {
      item[index] = itemToFauna(subItem);
    });
    return item;
  }

  // Date type
  if (isDateObject(item)) {
    return toFaunaDate(item as Date);
  }
  else if (isReferenceDocument(item)) {
    // fauna object
    return toFauna(item);
    return;
  } else {
    return itemToFauna(item);
  }

}

/**
 * Returns a FaunaDate object
 * @param date The JS object to convert into a Fauna date
 */
export function toFaunaDate(date: Date): Expr {
  return q.Time(date.toISOString());
}

interface BaseDocument {
  id?: string;
  collection?: string;
  ref?: Expr;
}


/**
 * Converts an id and collection to a Fauna Reference
 * @param doc The document or reference ID
 * @param collection The collection of the reference
 */
export function toFaunaRef(doc: DocumentReference | FaunaRef | string, collection?: string): Expr | undefined {
  if (doc === null) { return undefined; }
  if (typeof doc === "string" && !collection) { throw "A given string reference requires a collection"; }
  if (typeof doc === "string") {
    return q.Ref(q.Collection(collection as string), doc);
  }
  if ("ref" in doc && doc.ref) {
    if (doc.ref instanceof Expr) { return doc.ref; }
    if (typeof doc.ref === "object" && "@ref" in doc.ref) {
      const collectionAndID = parseFaunaRef(doc.ref);
      return q.Ref(q.Collection(collectionAndID.collection), collectionAndID.id);
    } else {
      return doc.ref as Expr;
    }
  } else if ("id" in doc && "collection" in doc) {
    return q.Ref(q.Collection(doc.collection as string), doc.id as string);
  }
  throw "Cannot build fauna reference.";
}

/**
 * Determines if a given item is a date object. Returns true if it is, false otherwise
 * TODO - test this!
 * @param item The possible date object to test
 */
function isDateObject(item: unknown) {
  if (!item || typeof item !== "object") { return false; }
  if (item instanceof Date) { return true; }
  return false;
}

function isReferenceDocument(item: unknown) {
  if (item === null) { return false; }
  if (!item || typeof item !== "object") { return false; }
  const castedItem = item as object;
  if (("id" in castedItem && "collection" in castedItem) || "ref" in castedItem) {
    return true;
  }
  return false;
}
