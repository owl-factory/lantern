import { GetOptions } from "features/dynamicRender/types/query";

/**
 * Takes a query string and converts it into options for accessing that data
 * in a StorageController
 * @param query - The query to parse into options
 * @returns A GetOptions object describing how to access a piece of data
 */
export function queryToOptions(query: string): GetOptions {
  query;
  // TODO laura needs to remove this throw statement and replace it with Result.
  // eslint-disable-next-line no-restricted-syntax
  throw "TODO";
}
