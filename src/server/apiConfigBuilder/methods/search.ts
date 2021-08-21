import { Expr } from "faunadb";
import { AnyDocument } from "types/documents";
import { getServerClient } from "utilities/db";
import { IndexConfig } from "../types";
import { query as q } from "faunadb";
import { parseFaunaRef } from "utilities/fauna";
import { set } from "utilities/objects";
import { FaunaIndexOptions, FaunaIndexResponse } from "types/fauna";
import { MyUserDocument } from "server/logic";
import { canActOn, getRole, trimRestrictedFieldsOn } from "../helpers";

/**
 * Runs a standardized search function for looking through indexes with minimal hassle. This should not be used directly
 * @param terms The terms to use as arguments to the index
 * @param options The options, if any, for determining how and what to return from pagination
 * @param myUser The current user making this call
 * @param config The search function configuration
 * @returns A promise with a list of any type of documents that match the index and are formatted to be allowed
 */
export async function $search(
  terms: (string | Expr)[],
  options: FaunaIndexOptions | undefined,
  myUser: MyUserDocument,
  config: IndexConfig
): Promise<AnyDocument[]> {
  const client = getServerClient();
  console.log(config)

  // Ensures default options, if options given are missing or incomplete
  options = ensureSearchOptions(options, config);

  // Preprocesses terms, either making sure that they are valid or correcting/altering them
  terms = config.preProcess(terms, myUser);

  // Queries the given index. This is automatically set up for pagination
  const result: FaunaIndexResponse = await client.query(
    q.Paginate(
      q.Match(q.Index(config.index), terms),
      options
    ),
  );
  console.log("HGWHWW")
  console.log(result)

  // Handles invalid results
  if (!result.data) {
    throw { code: 500, message: `An error occured while trying to search the ${config.index} index` };
  }
  let docs = parseIndexResponse(result.data, config.indexFields);
  console.log(docs)
  // Returns a subset of docs that the current user can see
  docs = canActOn(docs, myUser, config.roles);
  console.log(docs)

  docs = config.postProcess(docs, myUser);
  docs = trimRestrictedFieldsOn(docs, myUser, config.fields[getRole(myUser)]);
  console.log(docs)

  return docs;
}



// TODO
function ensureSearchOptions(options: FaunaIndexOptions | undefined, config: IndexConfig) {
  options = options || config.options || {};
  const newOptions = {
    size: options?.size || config.options.size,
  };
  return newOptions;
}

// TODO - move to a fauna conversion 
function parseIndexResponse(
  faunaResult: (string | number | unknown)[][], fields: string[]): AnyDocument[] {
  const parsedDocs: AnyDocument[] = [];
  faunaResult.forEach((item: (string | number | unknown)[]) => {
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
        const valueKey = fields[index];
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

  return parsedDocs;
}
