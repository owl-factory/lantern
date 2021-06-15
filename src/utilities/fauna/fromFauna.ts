import { isFaunaDate, isFaunaRef } from "utilities/fauna";

type AnyDocument = any;

/**
 * Maps fauna into a flatter data format for easier readability and accessibility.
 * @param faunaDoc The document to map from Fauna into a flat function
 * @param format The format to return the fauna function as. Valid options are 'class' or 'struct'.
 */
 export function fromFauna(faunaDoc: Record<string, unknown>): AnyDocument  {
  const mappedDoc: Record<string, unknown> = parseFaunaLayer(faunaDoc.data || {}, {});

  // Parse ref after the fact to ensure we have accurate values
  const ref = parseFaunaRef(faunaDoc.ref);
  mappedDoc.ref = faunaDoc.ref;
  mappedDoc.id = ref.id;
  mappedDoc.collection = ref.collection;
  mappedDoc.ts = faunaDoc.ts;
  mappedDoc.ttl = faunaDoc.ttl;

  return mappedDoc;
}

/**
 * Maps a document layer to a provided intitial document and returns it
 * @param faunaDoc The document to parse through
 * @param mappedDoc The document we would like to map the current layer to
 */
 function parseFaunaLayer(faunaDoc: any, mappedDoc: any = {}): Record<string, unknown> {
  const keys = Object.keys(faunaDoc);
  keys.forEach((key: string) => {
    const data = faunaDoc[key];
    mappedDoc[key] = parseFaunaItem(data);
  });

  return mappedDoc;
}

/**
 * Processes and maps a single item from a document object.
 * @param item The data to process and map
 */
function parseFaunaItem(item: unknown) {
  // If null, simply return the null
  if (item === null || item === undefined) { return item; }

  // If not an object, this is a simple type. Return the item as-is
  if (typeof item !== "object") { return item; }

  // If this is an array, loop through each item and parse it as well
  if (Array.isArray(item)) {
    item.forEach((subItem: unknown, index: number) => {
      // TODO - map layer item?
      item[index] = parseFaunaItem(subItem);
    });
    return item;
  }

  // If a Fauna date, parse into a Javascript Date
  if (isFaunaDate(item)) { return parseFaunaDate(item as Record<string, unknown>); }

  // If a Fauna Ref, parse into an object with the ID and Collection
  // TODO - remove this eventually. A ref should always be inside an object (eg: { image: { ref: [ref]}})
  if (isFaunaRef(item)) {
    const ref: AnyDocument = parseFaunaRef(item);
    ref.ref = item;
    return ref;
  }

  // If this contains a ref object, it is a fauna document
  if (item !== null && "ref" in item) { return fromFauna(item as Record<string, unknown>); }

  // If nothing else is matched, this is a simple object
  return parseFaunaLayer(item, {});
}

/**
 * Parses a ref object, regardless of the type that it is. Returns the
 * id and collection of the ref.
 * @param ref The ref object to parse
 */
 export function parseFaunaRef(ref: any): { id: string, collection: string } {
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
 * Parses a Fauna date into a common javascript date
 * @param date The Fauna date to parse into a Date
 */
function parseFaunaDate(date: Record<string, unknown>): Date {
  if ("@ts" in date && date["@ts"]) { return new Date(date["@ts"] as string | number | Date); }
  return new Date(date.value as string | number | Date);
}

