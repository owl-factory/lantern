
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { AnyDocument, CampaignDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner } from "./security";

const ContentLogicBuilder = new FaunaLogicBuilder("contents")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest([])
    .user(userViewableFields)
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(userViewable)
    .admin(true)
  .done()

  /**
   * Initializes the fetch function from defaults
   */
  .fetch()
  .done()

  /**
   * Creates a function for fetching many campaign documents at once. It should use the same
   * logic and security as the ordinary fetch fucntion
   */
  .fetchMany()
  .done()

  .fetchMany("fetchManyMyContent")
    .roles()
      .guest(false)
      .user(isOwner)
      .admin(true)
    .done()
    .fields()
      .guest([])
      .user(["*"])
    .done()
  .done()

  /**
   * Allows for searching through all of a user's campaigns from last played to oldest played
   * The index fields allow for base data to populate tiles
   */
  .search("fetchMyContent", "my_content_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["updatedAt", "ref", "name", "type.ref", "ruleset.ref"])
    // Explicitly allow the user since the index guarantees ownership/playing
    .roles()
      .user(true)
    .done()
    .postProcess(postProcessMyContent)
  .done()

.done();
export const ContentLogic = ContentLogicBuilder.export();

/**
 * Updates a user's documents fetched using the my content index search
 * @param doc The document to update
 * @param myUser The current user fetching these documents
 * @returns The updated document
 */
function postProcessMyContent(doc: AnyDocument, myUser: MyUserDocument) {
  doc.ownedBy = {
    id: myUser.id,
    collection: myUser.collection,
  };
  return doc;
}

/**
 * Determines if a standard user is able to view any part of a document
 * @param myUser The current user attempting to view
 * @param doc The document the user is attempting to view
 * @returns True if the user may view any part of the document, false otherwise
 */
function userViewable(myUser: MyUserDocument, doc?: AnyDocument): boolean {
  if (!doc) { return false; }
  if (isOwner(myUser, doc)) { return true; }

  return false;
}

/**
 * Determines which fields a user has access to in a given document
 * @param myUser The user attempting to view the document
 * @param doc The document the user is attempting to view
 * @returns An array of strings indicating what fields the user is able to see. *s indicate any field at that level
 */
function userViewableFields(myUser: MyUserDocument, doc?: AnyDocument): string[] {
  if (!doc) { return []; }

  // Is owner check
  if (isOwner(myUser, doc)) { return ["*"]; }

  // Edge case
  // TODO - can campaigns be public? Or should pre-generated campaigns be their own document type?
  return [];
}
