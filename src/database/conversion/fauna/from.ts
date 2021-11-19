import { FaunaDocument } from "database/types/fauna";
import { Ref64 } from "types";
import { encode } from "utilities/encoding";
import { set } from "utilities/objects";
import { isFaunaDate, isFaunaRef } from "./fauna";

/**
 * Maps fauna into a flatter data format for easier readability and accessibility.
 * @param faunaDoc The document to map from Fauna into a flat function
 * @param format The format to return the fauna function as. Valid options are 'class' or 'struct'.
 */
export function fromFauna(faunaDoc: FaunaDocument): Record<string, unknown> {
  const convertedDoc: Record<string, unknown> = fromRecord((faunaDoc.data || {}) as Record<string, unknown>);

  // Parse ref after the fact to ensure we have accurate values
  convertedDoc.ref = fromRef(faunaDoc.ref);

  return convertedDoc;
}

/**
 * Converts an array of Fauna data into a usable array of JSON data
 * @param data The data of data items to convert into usable JSON data
 * @returns An array of converted JSON data
 */
function fromArray(data: unknown[]): unknown[] {
  const convertedData: unknown[] = [];

  data.forEach((item: unknown) => {
    const convertedItem = fromItem(item);
    if (convertedItem === undefined) { return; }
    convertedData.push(convertedItem);
  });

  return convertedData;
}

/**
 * Parses a Fauna date into a common javascript date
 * @param date The Fauna date to parse into a Date
 */
 function fromDate(date: Record<string, unknown>): Date {
  if ("@ts" in date && date["@ts"]) { return new Date(date["@ts"] as string | number | Date); }
  return new Date(date.value as string | number | Date);
}

/**
 * Converts a Fauna data object to a usable JSON object
 * @param data The data record to convert into a usable JSON object
 * @returns A converted JSON object
 */
function fromRecord(data: Record<string, unknown>): Record<string, unknown> {
  const convertedData: Record<string, unknown> = {};
  const dataKeys = Object.keys(data);

  dataKeys.forEach((dataKey: string) => {
    convertedData[dataKey] = fromItem(data[dataKey]);
  });

  return convertedData;
}

/**
 * Converts a single piece of Fauna data into usable JSON data
 * @param data The single item to convert from Fauna to a JSON item
 * @returns The converted data
 */
function fromItem(data: unknown) {
  const dataType: string = getFaunaDataType(data);
  switch(dataType) {
    case "boolean":
    case "number":
    case "bigint":
    case "symbol":
      return data;
    case "undefined": 
      return undefined;
    case "array":
      return fromArray(data as unknown[]);
    case "ref":
      return fromRef(data);
    case "date":
      return fromDate(data as Record<string, unknown>);
    case "object":
      return fromRecord(data as Record<string, unknown>);
  }
}

/**
 * Parses a ref object, regardless of the type that it is. Returns the
 * id and collection of the ref.
 * @param ref The ref object to parse
 */
 export function fromRef(ref: any): Ref64 | undefined {
  let id, collection = "";
  if (ref === null)
    return undefined;

    if ("@ref" in ref && "id" in ref["@ref"]) {
    id = ref["@ref"].id;
    collection = ref["@ref"].collection["@ref"].id;
  } else if ( "value" in ref && "id" in ref.value ) {
    id = ref.value.id;
    collection = ref.collection.id;
  }

  return encode(id, collection);
}

/**
 * Determines the type of Fauna data that was passed in
 * @param data The data to infer type from
 * @returns The type of the data as a string
 */
function getFaunaDataType(data: unknown): string {
  if (data === undefined || data === null) { return "undefined"; }
  else if (typeof data !== "object") { return typeof data; }
  else if (Array.isArray(data)) { return "array"; }
  else if (isFaunaRef(data)) { return "ref"; }
  else if (isFaunaDate(data)) { return "date"; }
  else { return "object"; }
} 

/**
 * Parses an index response from a 2D array of strings, numbers, and unknowns into a list of documents
 * @param faunaDocs The index documents returned from a fauna index search
 * @param fields A list of fields in order that represent the output of the index
 * @returns Returns a list of documents
 */
export function fromIndex(faunaDocs: unknown[], fields: string[]): Record<string, unknown>[] {
  const convertedDocs: Record<string, unknown>[] = [];

  faunaDocs.forEach((faunaDoc: unknown | unknown[]) => {
    const convertedDoc: Record<string, unknown> = {};

    if (!Array.isArray(faunaDoc)) { 
      convertedDoc.ref = fromRef(faunaDoc);
      convertedDocs.push(convertedDoc);
      return;
    }

    faunaDoc.forEach((faunaItem: unknown, index: number) => {
      const key = fields[index];
      set(convertedDoc, key, fromItem(faunaItem));
    });
    convertedDocs.push(convertedDoc);
  });

  return convertedDocs;
}
