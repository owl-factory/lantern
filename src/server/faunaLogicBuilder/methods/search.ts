import { Expr } from "faunadb";
import { AnyDocument } from "types/documents";
import { getServerClient } from "utilities/db";
import { IndexConfig } from "../types";
import { query as q } from "faunadb";
import { parseIndexResponse } from "utilities/fauna";
import { FaunaIndexOptions, FaunaIndexResponse } from "types/fauna";
import { canActOn, getRole } from "../helpers";
import { MyUserDocument } from "types/security";
import { trimRestrictedFieldsOn } from "utilities/security";

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

  // Handles invalid results
  if (!result.data) {
    throw { code: 500, message: `An error occured while trying to search the ${config.index} index` };
  }
  let docs = parseIndexResponse(result.data, config.indexFields);
  // Returns a subset of docs that the current user can see
  docs = canActOn(docs as any, myUser, config.roles);
  docs.forEach((doc: any) => {
    doc = config.postProcess(doc, myUser);
  });
  docs = trimRestrictedFieldsOn(docs as any, myUser, config.fields[getRole(myUser)]);
  return docs as any;
}

/**
 * Ensures that search options are present and are filled with the default options, if any
 * @param options The given fauna options
 * @param config The given configuration, which may contain the default options
 * @returns Returns options, filling in blank spots with default values, if any
 */
function ensureSearchOptions(options: FaunaIndexOptions | undefined, config: IndexConfig) {
  options = options || config.options || {};
  const newOptions = {
    size: options?.size || config.options.size,
  };
  return newOptions;
}
