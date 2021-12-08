import { Ref64 } from "types";

// A standard package for returning errors from an API call
export interface Errors {
  context?: { ref?: Ref64; name?: string }
  errors: string[];
}

/**
 * Determines if a given item is an Errors type
 * @param doc The document of unknown status
 * @returns True if the given item is an error; false otherwise
 */
export function isError(doc: any): boolean {
  if (typeof doc !== "object" || doc === null) { return false; }
  if ("errors" in doc && doc.errors && Array.isArray(doc.errors)) { return true; }
  return false;
}
