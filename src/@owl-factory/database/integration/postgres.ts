import { DataType, Value } from "ts-postgres";
import { getClient } from "../client/postgres";
import { fromQuery } from "../conversion/postgres/from";
import { QueryParam } from "../types/postgres";


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

  console.log(queryStr, parsedParams, parsedTypes)
  const result = await client.query(queryStr, parsedParams, parsedTypes);

  return fromQuery(result);
}
