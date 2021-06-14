import { Expr, query as q } from "faunadb";
import { DocumentReference } from "server/logic/CoreModelLogic";
import { isFaunaRef } from "utilities/fauna";

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

  faunaDoc.data = mapObjectToFaunaLayer(doc);
  return faunaDoc;
}

/**
 * Maps a single layer of items to a fauna document. This step skip
 * @param doc The document to map
 */
function mapObjectToFaunaLayer(doc: AnyDocument) {
  const keys = Object.keys(doc);
  const faunaDoc: Record<string, unknown> = {};
  keys.forEach((key: string) => {
    // Skip item if it's a special case
    if (key in ["id", "ref", "collection", "ts", "ttl"]) { return; }
    const value = doc[key];

    // Do nothing if simple type
    if (typeof value !== "object") {
      faunaDoc[key] = value;
    }

    // Date type
    if (typeof value.getMonth === "function") {
      faunaDoc[key] = toFaunaDate(value);
    }
    else if ("id" in value && "collection" in value || "ref" in value) {
      // fauna object
      faunaDoc[key] = toFauna(value);
    } else {
      faunaDoc[key] = mapObjectToFaunaLayer(value);
    }

  });
}

/**
 * Returns a FaunaDate object
 * @param date The JS object to convert into a Fauna date
 */
export function toFaunaDate(date: Date): Expr {
  return q.Date(date.toISOString());
}

interface BaseDocument {
  id?: string;
  collection?: string;
  ref?: Expr;
}


/**
 * Converts an id and collection to a Fauna Reference
 * @param id The id of the reference
 * @param collection The collection of the reference
 */
export function toFaunaRef(doc: DocumentReference): Expr {
  if ("ref" in doc && doc.ref && isFaunaRef(doc.ref)) {
    return doc.ref as Expr;
  } else if ("id" in doc && "collection" in doc) {
    return q.Ref(q.Collection(doc.collection as string), doc.id as string);
  }
  throw "Cannot build fauna reference.";
}
