import { Expr, query as q } from "faunadb";



/**
 * Checks if the given data object is a Fauna ref.
 * @param item The data to check if it is a Fauna ref
 */
export function isFaunaRef(item: unknown): boolean {
  if (item === null || typeof item !== "object") { return false; }
  const castedItem = item as Record<string, unknown>;
  if ("@ref" in castedItem) { return true; }
  if (castedItem.value && typeof castedItem.value === "object" && "id" in castedItem.value) { return true; }
  return false;
}

/**
 * Determines if an object is a Fauna date.
 * @param item The data object to determine if a Fauna date
 */
export function isFaunaDate(item: unknown): boolean {
  if (item === null || typeof item !== "object") { return false; }

  const castedItem = item as Record<string, unknown>;
  if (castedItem["@ts"]) { return true; }
  if (castedItem.value && typeof castedItem.value === "string" && Date.parse(castedItem.value)) { return true; }
  return false;
}


/**
   * Determine if the given document is a fauna error or not
   * @param doc The document to determine if an error or not.
   * TODO - create this
   * TODO - move to utilities/fauna
   */
export function isFaunaError(doc: unknown): boolean {
  return false;
}

