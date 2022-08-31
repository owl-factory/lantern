import { DataType, Value } from "ts-postgres";
import { getClient } from "../client/postgres";
import { fromQuery } from "../conversion/postgres/from";
import { QueryParam } from "../types/postgres";

/**
 * Queries the Postgres database
 * @param queryStr The raw query string to submit
 * @param params The values used within the query to prevent any injection attacks
 * @returns The results of the query
 */
export async function query(queryStr: string, params: QueryParam[] = []) {
  const client = await getClient();

  const parsedParams: Value[] = [];
  const parsedTypes: DataType[] = [];

  for (const param of params) {
    if (typeof param === "string") {
      parsedParams.push(param);
      parsedTypes.push(DataType.Text);
      continue;
    }

    parsedParams.push(param.value);
    parsedTypes.push(param.dataType);
  }

  try {
    const result = await client.query(queryStr, parsedParams, parsedTypes);
    // TODO - add handling for different query responses
    return fromQuery(result);
  } catch (e: unknown) {
    throw "An error occurred when running the query";
  }

}
