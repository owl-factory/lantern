import { fieldInObject, read } from "@owl-factory/utilities/objects";
import { DataManager } from "../AbstractDataManager";

/**
 * Gets the ref for a document. Undefined refs are returned as empty strings
 * @protected
 * @param doc The document to parse the ref from
 * @returns A string containing the ref or an empty string
 */
export function getRef<T extends Record<string, unknown>>(this: DataManager<T>, doc: T): string {
  if (!fieldInObject(doc, this.refField)) { return ""; }

  const ref = read(doc, this.refField);
  if (typeof ref !== "string") { return ""; }

  return ref;
}

/**
 * Determines the time that this document was last updated, if any
 * @protected
 * @param doc The doc to parse the updatedAt time from
 * @returns A number greater than or equal to 0
 */
export function getUpdatedAt<T extends Record<string, unknown>>(this: DataManager<T>, doc: T): number {
  // Handles case where the object is missing an updated time. Defaults to 0
  if (!fieldInObject(doc, this.updatedAtField)) { return 0; }

  // In a try-catch block to prevent issues from invalid Dates
  try {
    const value = read(doc, this.updatedAtField);
    if (typeof value !== "string" || typeof value !== "number" || typeof value !== "object") { return 0; }

    const date = new Date(value as (string | number | Date));
    return date.valueOf();

  } catch {
    return 0;
  }
}
