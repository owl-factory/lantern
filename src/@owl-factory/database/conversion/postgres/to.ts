// import { getGlobalAuth } from "@owl-factory/auth/globals";
import { QueryParam } from "@owl-factory/database/types/postgres";
import { DataType } from "ts-postgres";
import { v4 as uuid } from "uuid";

/**
 * Converts a document and conversion map into a INSERT INTO string and parameters. The returned string is of
 * the format `(field1, field2, ...) VALUES ($1, $2, ...) `.
 * @param originalDocument The document to create in the database
 * @param conversionMap The mapping of fields to postgres data types
 * @param startIndex The starting index of the Postgres query variables
 * @returns A portion of an insert string
 */
export function toInsert(
  originalDocument: Record<string, unknown>,
  conversionMap: Record<string, DataType>,
  startIndex = 1
): { queryStr: string, params: QueryParam[] } {
  // Shallow copy to prevent create & update additions from affecting the original object
  const document = { ...originalDocument };

  // Sets the standard values for
  document.id = uuid();
  document.created_at = new Date();
  document.updated_at = new Date();

  // const auth = getGlobalAuth();
  // if (auth.user.id) {
  //   document.created_by = auth.user.id;
  //   document.updated_by = auth.user.id;
  // }

  const params: QueryParam[] = [];
  const keys = Object.keys(document);

  let fields = "";
  let values = "";
  let i = startIndex;

  for (const key of keys) {
    const originalValue = document[key];
    const dataType = conversionMap[key];

    fields += `${key}, `;
    values += `$${i++}, `;
    params.push(convertFieldTo(originalValue, dataType));
  }

  // Removes the comma
  if (fields.length > 2) {
    fields = fields.slice(0, fields.length - 2);
    values = values.slice(0, values.length - 2);
  }

  const combinedQuery = `(${fields}) VALUES (${values}) `;

  return { queryStr: combinedQuery, params };
}

/**
 * Converts a document and conversion map into a UPDATE SET string and parameters. The returned string is of
 * the format `SET field1=$1, field2=$2... `.
 * @param originalDocument The partial document to update in the database
 * @param conversionMap The mapping of fields to postgres data types
 * @param startIndex The starting index of the Postgres query variables
 * @returns A portion of an insert string
 */
export function toSet(
  originalDocument: Record<string, unknown>,
  conversionMap: Record<string, DataType>,
  startIndex = 1
): { queryStr: string, params: QueryParam[] } {
  // Shallow copy to prevent create & update additions from affecting the original object
  const document = { ...originalDocument };
  document.updated_at = new Date();

  // const auth = getGlobalAuth();
  // if (auth.user.id) {
  //   document.updated_by = auth.user.id;
  // }

  const params: QueryParam[] = [];
  const keys = Object.keys(document);

  let i = startIndex;
  let setStr = "SET ";

  for (const key of keys) {
    const originalValue = document[key];
    const dataType = conversionMap[key];
    setStr += `${key} = $${i++}, `;
    params.push(convertFieldTo(originalValue, dataType));
  }

  // Removes trailing comma
  if (setStr.length > 2) { setStr = setStr.slice(0, setStr.length - 2); }

  return { queryStr: setStr, params };
}

/**
 * Converts an unknown field into a string matching the format of the given datatype
 * @param originalValue The original value to convert into a string for storing to the database
 * @param dataType The datatype that this value will become
 * @returns A query parameter containing the value (as a string) and the data type
 */
function convertFieldTo(originalValue: unknown, dataType: DataType): QueryParam {
  const param: QueryParam = { value: "", dataType };

  // If the originalValue is null, return it without handling conversion since this value is being removed
  if (originalValue === null) { return { value: null, dataType }; }

  try {
    switch (dataType) {
      case DataType.Date:
        param.value = (originalValue as Date).toISOString();
        break;
      case DataType.Json:
        param.value = JSON.stringify(originalValue);
        break;

      case DataType.Text:
      case DataType.Uuid:
      default:
        param.value = originalValue as string;
        break;
    }
  } catch (e) {
    return originalValue as string;
  }

  return param;
}
