
import { FaunaDocument } from "types/fauna";
import { getServerClient } from "utilities/db";
import { fromFauna, toFaunaRef } from "utilities/fauna";
import { canAct, canActStatic, checkConfig, getRole } from "../helpers";
import { FunctionConfig } from "../types";
import { query as q } from "faunadb";
import { AnyDocument } from "types/documents";
import { DocumentReference } from "server/logic";
import { MyUserDocument } from "types/security";
import { determineAccessibleFields, trimRestrictedFields } from "utilities/security";

/**
 * A standard function that fetches a single document by ID from the database
 * @param ref A reference, either a qualified fauna reference or a string, indicating the document to fetch
 * @param myUser The current user attempting to fetch the document
 * @param config The fetch function configuration
 */
export async function $fetch(ref: string | DocumentReference, myUser: MyUserDocument, config: FunctionConfig) {
  const client = getServerClient();
  checkConfig(config);

  // Static checks that can exit out before anything is done
  const newRef = toFaunaRef(ref, config.collection );
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to access this resource."};
  }
  if (!canActStatic(myUser, config.roles)) { throw {code: 401, message: "You do not have access to this resource."}; }

  // Fetches and converts the query into something readable
  let result: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (result === null || !canAct(result, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  const fields = determineAccessibleFields(result as AnyDocument, myUser, config.fields[getRole(myUser)]);
  result = trimRestrictedFields(result as Record<string, unknown>, fields, true);

  return result;
}
