import { DataType, Result } from "ts-postgres";

/**
 * Converts data from a postgres query result into an array of objects
 * @param postgreResult The result from a postgres query
 */
export function fromQuery<T extends Record<string, string>>(postgresResult: Result): T[] {
  // TODO - ensure that this is okay
  if (postgresResult.names === null || postgresResult.rows === null) { return []; }

  const results: T[] = [];
  const length = postgresResult.names.length;
  for (const row of postgresResult.rows) {
    const result: Partial<T> = {};
    for (let i = 0; i < length; i++) {
      const name = postgresResult.names[i];
      result[name as keyof T] = row[i] as any;
    }
    results.push(result as T);
  }

  return results;
}

/**
 * Converts an array of documents from their raw query response to their appropriate types
 * @param documents The array of documents to convert
 * @param conversionMap The mapping of keys to data types
 * @returns An array of converted documents
 */
export function convertManyFrom<T extends Record<string, unknown>>(
  documents: Record<string, string>[],
  conversionMap: Record<string, DataType>
) {
  const convertedDocuments: T[]  = [];
  for (const document of documents) {
    convertedDocuments.push(convertFrom(document, conversionMap));
  }
  return convertedDocuments;
}

/**
 * Converts a document from a Record string, string type to the type defined by the 
 * @param document The raw string-string document to convert into appropriate data
 * @param conversionMap The mapping of keys to data types
 * @returns A document with converted data matching the given map
 */
 export function convertFrom<T extends Record<string, unknown>>(
  document: Record<string, string>,
  conversionMap: Record<string, DataType>
) {
  const convertedDocument: Record<string, unknown> = {};
  const keys = Object.keys(document);
  for (const key of keys) {
    const originalValue = document[key];
    const dataType = conversionMap[key];
    convertedDocument[key] = convertFieldFrom(originalValue, dataType);
  }
  return convertedDocument as T;
}

/**
 * Converts a single field's value from the original string to the appropriate type.
 * In the event of errors, this will instead return the original error
 * @param originalValue The original value of the field
 * @param dataType The type of data to convert the field to
 * @returns The converted data
 */
function convertFieldFrom(originalValue: string, dataType: DataType): unknown {
  try {
    switch (dataType) {
      case DataType.Date:
        return new Date(originalValue);

      case DataType.Json:
        return JSON.parse(originalValue);

      case DataType.Text:
      case DataType.Uuid:
        default:
        return originalValue;
    }
  } catch (e) {
    // If there's an error, skip the conversion and pass it as is
    return originalValue;
  }
}
