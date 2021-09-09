import { DocumentReference } from "server/logic";
import { AnyDocument } from "types/documents";
import { FaunaDocument } from "types/fauna";
import { getServerClient } from "utilities/db";
import { fromFauna, toFaunaRef } from "utilities/fauna";
import { canAct, canActStatic, getRole } from "../helpers";
import { FunctionConfig } from "../types";
import { Expr, query as q } from "faunadb";
import { MyUserDocument } from "types/security";
import { determineAccessibleFields, trimRestrictedFields } from "utilities/security";

/**
 * Deletes a single document from the database
 * @param ref The reference or ID of the document to delete
 * @param myUser The current user attempting to delete a document
 * @param config The delete function configuration
 */
export async function $update(
  ref: string | DocumentReference,
  doc: AnyDocument,
  myUser: MyUserDocument,
  config: FunctionConfig
) {
  const client = getServerClient();
  const newRef = toFaunaRef(ref, config.collection);

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to update this resource." };
  }
  if (!canActStatic(myUser, config.roles)) {
    throw { code: 401, message: "You do not have access to update this resource."};
  }

  // Fetches the document to ensure that it can be deleted by the current user
  let faunaDoc: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (faunaDoc) { faunaDoc = fromFauna(faunaDoc as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (faunaDoc === null || !canAct(faunaDoc as AnyDocument, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found or you do not have permission to update it." };
  }

  // Preprocesses, setting certain fields and doing any required steps before updating
  doc = config.preProcess(doc, myUser);
  doc = preUpdate(doc, myUser, config) as unknown as AnyDocument;

  let result: FaunaDocument<unknown> | null = await client.query(q.Update(faunaDoc.ref as Expr, doc));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  // This should never be hit but is here for safety
  if (result === null) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  const fields = determineAccessibleFields(result as AnyDocument, myUser, config.fields[getRole(myUser)]);
  result = trimRestrictedFields(result as Record<string, unknown>, fields, true);

  return result;
}

/**
 * Applies standard update changes to a document
 * @param doc The document to apply pre-update changes to
 * @param myUser The current user that is updating the document
 * @returns An updated document ready to be updated
 */
function preUpdate(doc: AnyDocument, myUser: MyUserDocument, config: FunctionConfig) {
  const fields = determineAccessibleFields(doc, myUser, config.setFields[getRole(myUser)]);
  const newDoc = trimRestrictedFields(doc as unknown as Record<string, unknown>, fields, false);

  newDoc.updatedAt = new Date();
  newDoc.updatedBy = { id: myUser.id, collection: myUser.collection };

  delete newDoc.id;
  delete newDoc.collection;
  delete newDoc.ref;

  return newDoc;
}
