import { Expr } from "faunadb";
import { AnyDocument } from "types/documents";
import { getServerClient } from "utilities/db";
import { IndexConfig } from "../ApiConfigBuilder";
import { query as q } from "faunadb"
import { parseFaunaRef } from "utilities/fauna";
import { set } from "utilities/objects";
import { FaunaIndexOptions, FaunaIndexResponse } from "types/fauna";

export async function $search(
  terms: (string | Expr)[],
  options: FaunaIndexOptions | undefined,
  config: IndexConfig
): Promise<AnyDocument[]> {
  const client = getServerClient();
  // TODO - set default options
  options = ensureSearchOptions(options, config);
  
  const result: FaunaIndexResponse = await client.query(
    q.Paginate(
      q.Match(q.Index(config.index), terms),
      options
    ),
  );

  if (!result.data) {
    throw { code: 500, message: `An error occured while trying to search the ${config.index} index` };
  }

  // TODO - move into parse function??
  const parsedDocs: AnyDocument[] = [];
  result.data.forEach((item: (string | number | unknown)[]) => {
    const parsedDoc: AnyDocument = {};
    
    if (!Array.isArray(item)) {
      const { id, collection } = parseFaunaRef(item);
      parsedDoc.ref = item;
      parsedDoc.id = id;
      parsedDoc.collection = collection;
    } else {
      // For each item, there is a given term that maps it. The end result should
      // resemble a mapped object
      item.forEach((value: (string | number | unknown), index: number) => {
        const valueKey = config.indexFields[index];
        // (parsedDoc as Record<string, unknown>)[valueKey] = value;

        if (valueKey === "ref") {
          const { id, collection } = parseFaunaRef(item);
          parsedDoc.id = id;
          parsedDoc.collection = collection;
        }
        // Deep sets, deliminating the value key's periods
        set(parsedDoc as Record<string, unknown>, valueKey, value);
      });
    }
    parsedDocs.push(parsedDoc);
  });


}

// TODO
function ensureSearchOptions(options: FaunaIndexOptions | undefined, config: IndexConfig) {
  options = options || config.options || {};
  const newOptions = {
    size: options?.size || config.options.size,
  };
  return newOptions;
}
