import { MyUserDocument, trimRestrictedFields } from "server/logic";
import { AnyDocument } from "types/documents";
import { FaunaDocument } from "types/fauna";
import { getServerClient } from "utilities/db";
import { fromFauna, toFauna } from "utilities/fauna";
import { FunctionConfig } from "../types";
import { canActStatic, getRole } from "../helpers";
import { query as q } from "faunadb";

/**
 * Creates a document in the configured collection
 * @param doc The given document to create
 * @param myUser The user attempting to create a document
 * @param config The function configuration describing the function rules
 * @returns The created document
 */
export async function $create(doc: AnyDocument, myUser: MyUserDocument, config: FunctionConfig): Promise<AnyDocument> {
  const client = getServerClient();

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to create this resource."};
  }
  if (!canActStatic(myUser, config.roles)) { throw {code: 401, message: "You cannot create this resource"}; }

  // Runs all pre-processing of the document before creating it
  doc = config.preprocess(doc);
  doc = trimRestrictedFields(doc as Record<string, unknown>, config.setFields[getRole(myUser)]);
  doc = preCreate(doc, myUser);

  const faunaDoc: FaunaDocument<unknown> = toFauna(doc);
  const faunaResult = await client.query(q.Create(config.collection, faunaDoc)) as Record<string, unknown>;

  // TODO - how are errors thrown from fauna
  let result = fromFauna(faunaResult);
  result = config.postprocess(result);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return result;
}

/**
 * Applies standard creation changes to a document
 * @param doc The document to apply standard pre-creation actions upon
 * @param myUser The current user creating the document
 * @returns The updated document for creation
 */
function preCreate(doc: AnyDocument, myUser: MyUserDocument) {
  doc.createdAt = new Date();
  doc.updatedAt = doc.createdAt;
  doc.createdBy = { id: myUser.id, collection: myUser.collection };
  doc.updatedBy = doc.createdBy;
  doc.ownedBy = doc.createdBy;

  return doc;
}
