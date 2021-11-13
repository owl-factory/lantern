import { DocumentReference } from "server/logic";
import { FaunaDocument } from "types/fauna";
import { getServerClient } from "utilities/db";
import { canAct, canActStatic, getRole } from "../helpers";
import { FunctionConfig } from "../types";
import { query as q } from "faunadb";
import { trimRestrictedFields } from "utilities/security";
import { MyUserDocument } from "types/security";
import { AnyDocument } from "types/documents";
import { toFaunaRef } from "database/conversion/fauna/to";
import { fromFauna } from "database/conversion/fauna/from";

/**
 * Deletes a single document from the database
 * @param ref The reference or ID of the document to delete
 * @param myUser The current user attempting to delete a document
 * @param config The delete function configuration
 */
export async function $delete(ref: string | DocumentReference, myUser: MyUserDocument, config: FunctionConfig) {
  const client = getServerClient();
  const newRef = toFaunaRef(ref, config.collection);

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to delete this resource." };
  }
  if (!canActStatic(myUser, config.roles)) {
    throw { code: 401, message: "You do not have access to delete this resource."};
  }

  // Fetches the document to ensure that it can be deleted by the current user
  let faunaDoc: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (faunaDoc) { faunaDoc = fromFauna(faunaDoc as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (faunaDoc === null || !canAct(faunaDoc as AnyDocument, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found or you do not have permission to delete it." };
  }

  const preProcessResult = config.preProcess(faunaDoc, myUser);
  let result: FaunaDocument<unknown> | null = await client.query(q.Delete(newRef));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  // This should never be hit but is here for safety
  if (result === null) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return { result, preProcessResult };
}
