import { CoreDocument } from "types";
import { FaunaDocument, FaunaRef } from "types/fauna";

/**
 * Maps fauna into a flatter data format for easier readability and accessibility.
 * @param doc The document to map from Fauna into a flat function
 * @param format The format to return the fauna function as. Valid options are 'class' or 'struct'.
 */
 export function mapFauna(doc: FaunaDocument<unknown>): CoreDocument {
  let mappedDoc: any = {};

  // Nab all of the data data
  mappedDoc = mapLayer(doc.data, mappedDoc);

  // Run after to ensure that any reserved words in the data are overridden.
  // TODO - change these keys to unique keys?
  const ref = parseRef(doc.ref);
  mappedDoc.id = ref.id;
  mappedDoc.ts = doc.ts;
  mappedDoc.ref = doc.ref;

  if (!("collection" in mappedDoc)) {
    mappedDoc.collection = ref.collection;
  }

  return mappedDoc;
}

/**
 * Maps a document layer to a provided intitial document and returns it
 * @param doc The document to parse through
 * @param initialDoc The document we would like to map the current layer to
 */
 function mapLayer(doc: any, initialDoc: any = {}) {
  const keys = Object.keys(doc);
  keys.forEach((key: string) => {
    const data = doc[key];
    initialDoc[key] = mapLayerItem(data);

  });
  return initialDoc;
}

/**
 * Checks if the given data object is a Fauna ref.
 * @param data The data to check if it is a Fauna ref
 */
function isFaunaRef(data: Record<string, unknown>): boolean {
  if (typeof data !== "object") { return false; }
  if ("@ref" in data) { return true; }
  if (data.value && typeof data.value === "object" && "id" in data.value) { return true; }
  return false;
}

/**
 * Parses a ref object, regardless of the type that it is. Returns the
 * id and collection of the ref.
 * @param ref The ref object to parse
 */
export function parseRef(ref: any): { id: string, collection: string } {
  let id, collection = "";
  if ("@ref" in ref && "id" in ref["@ref"]) {
    id = ref["@ref"].id;
    collection = ref["@ref"].collection["@ref"].id;
  } else if ( "value" in ref && "id" in ref.value ) {
    id = ref.value.id;
    collection = ref.collection.id;
  }

  return { id, collection };
}

/**
 * Determines if an object is a Fauna date.
 * @param data The data object to determine if a Fauna date
 */
function isFaunaDate(data: Record<string, unknown>): boolean {
  if ("@ts" in data) { return true; }
  if (data.value && typeof data.value === "string" && Date.parse(data.value)) { return true; }
  return false;
}

/**
 * Parses a Fauna date into a common javascript date
 * @param date The Fauna date to parse into a Date
 */
function parseFaunaDate(date: Record<string, unknown>): Date {
  if ("@ts" in date && date["@ts"]) { return new Date(date["@ts"] as string | number | Date); }
  return new Date(date.value as string | number | Date);
}

/**
 * Processes and maps a single item from a document object. 
 * @param data The data to process and map
 */
function mapLayerItem(data: any) {
  if (typeof data !== "object") { return data; }
  // Date?
  if (isFaunaDate(data)) { return parseFaunaDate(data); }
  if (Array.isArray(data)) {
    data.forEach((item: unknown, index: number) => {
      // TODO - map layer item?
      data[index] = mapLayerItem(item);
    });
    return data;
  }
  // Fauna Ref
  if (isFaunaRef(data)) { 
    const ref = parseRef(data);
    return { ...ref, ref: data };
  }

  // Fauna Object
  if ("ref" in data) { return mapFauna(data); }

  // Just an object layer
  return mapLayer(data, {});
}
