import { Expr, query as q, ToArray, ToDate } from "faunadb";
import { decode, isEncoding } from "utilities/encoding";
import { fromRef } from "./from";
import { Ref64 } from "types";
import { FaunaDocument } from "database/types/fauna";

/**
 * Converts a Javascript document into a Fauna document for saving to the database
 * @param doc The JS document to convert into a Fauna Document
 */
export function toFauna(doc: Record<string, unknown>): FaunaDocument {
  const faunaDoc: Partial<FaunaDocument> = {};

  // Sets the ref
  if (doc.ref) { faunaDoc.ref = toRef(doc.ref as string); }
  if (doc.ts) { faunaDoc.ts = doc.ts as number; }
  if (doc.ttl) { faunaDoc.ts = doc.ttl as number; }

  faunaDoc.data = toRecord(doc);
  return faunaDoc as FaunaDocument;
}

/**
 * Converts an array of JSON data items into a format compatible with fauna
 * @param data The array with JSON items to convert into a usable fauna format
 * @returns A converted Fauna array
 */
function toArray(data: unknown[]): unknown[] {
  const faunaData: unknown[] = [];

  data.forEach((item: unknown) => {
    const faunaItem = toItem(item);
    if (faunaItem === undefined) { return; }
    faunaData.push(faunaItem);
  });

  return faunaData;
}

/**
 * Converts a Javascript Date object to a Fauna date
 * @param data The Javascript date object to convert
 * @returns A converted Fauna date
 */
function toDate(data: Date) {
  return q.Time(data.toISOString());
}

/**
 * Converts a Javascript object to a saveable Fauna object
 * @param data The Javascript object to convert
 * @returns A converted Fauna record
 */
function toRecord(data: Record<string, unknown>): Record<string, unknown> {
  const faunaData: Record<string, unknown> = {};
  const dataKeys = Object.keys(data);

  dataKeys.forEach((dataKey: string) => {
    data[dataKey] = toItem(data[dataKey]);
  }); 

  return faunaData;
}

/**
 * Converts a Javascript item of unknown type into the appropriate Fauna format
 * @param data The item to convert
 * @returns A converted Fauna item
 */
function toItem(data: unknown): unknown {
  const dataType: string = getDataType(data);
  switch(dataType) {
    case "boolean":
    case "number":
    case "bigint":
    case "symbol":
      return data;
    case "undefined": 
      return undefined;
    case "array":
      return toArray(data as unknown[]);
    case "date":
      return toDate(data as Date);
    case "ref":
      return toRef(data as string);
    case "object":
      return toRecord(data as Record<string, unknown>);
  }

  return data;
}

/**
 * Converts a ref64 ID back into a Fauna ref
 * @param ref64ID The Ref64 ID to convert into the original fauna ref.
 * @returns A Fauna Ref expr.
 */
 export function toRef(ref64ID: Ref64): Expr {
  const { id, collection } = decode(ref64ID);
  const ref = q.Ref(q.Collection(collection as string), id);
  return ref;
}

/**
 * Determines the type of the given data item
 * @param data The Javascript object to determine the type of
 * @returns The type of the given data item
 */
function getDataType(data: unknown) {
  if (data === undefined || data === null) { return "undefined"; }
  else if (typeof data === "string" && isEncoding(data)) { return "ref64"; }
  else if (typeof data !== "object") { return typeof data; }
  else if (Array.isArray(data)) { return "array"; }
  else if (Object.prototype.toString.call(data) === '[object Date]') { return "date"; }
  else { return "object"; }
}
