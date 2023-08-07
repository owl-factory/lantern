import { SheetProperties } from "../types";

/**
 * Parses a content field and properties into arguments for accessing the value that needs to be changed
 * @param field The value used for the input name
 * @param properties The sheet properties as they are within the form
 * @returns An object containing the contentType key, the array index, and the name of the field to set
 */
export function parseContentFieldArguments(field: string, properties: SheetProperties) {
  const variableKey = field.replace(/\..+$/, "");
  const contentType = (properties._source[variableKey] || "content.").substring(8);
  const index = properties._index[variableKey];
  const name = field.replace(/^.+\./, "");

  return { contentType, index, name };
}
