
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { CampaignDocument, UserDocument } from "types/documents";
import { MyUserDocument } from "types/security";

const USER_VIEW_FIELDS: string[] = [
];
const RulesetLogicBuilder = new FaunaLogicBuilder("rulesets")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest(["*"])
  .done()
  .roles()
    .guest(true)
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

  .create()
    .roles()
      .guest(false)
      .user(false)
      .moderator(false)
      .admin(true)
    .done()
    .setFields()
      .admin(["name", "isOfficial"])
    .done()
  .done()

  .update("setPublic")
    .roles()
      .guest(false)
      .user(false)
      .moderator(false)
      .admin(true)
    .done()
    .setFields()
      .guest([])
      .admin(["isPublic"])
    .done()
  .done()

  .update("lockRuleset")

  .done()

  .search("fetchOfficialRulesets", "rulesets_by_official")
    .indexFields(["ref", "name", "ownedBy", "isPublic", "isLocked"])
  .done()


.done();
export const RulesetLogic = RulesetLogicBuilder.export();

/**
 * Determines if a standard user is able to view any part of a document
 * @param myUser The current user attempting to view
 * @param doc The document the user is attempting to view
 * @returns True if the user may view any part of the document, false otherwise
 */
function userViewable(myUser: MyUserDocument, doc?: CampaignDocument): boolean {
  if (!doc) { return false; }
  if (doc.ownedBy?.id === myUser.id) { return true; }
  doc.players?.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return true; }
  });

  return false;
}

/**
 * Determines which fields a user has access to in a given document
 * @param myUser The user attempting to view the document
 * @param doc The document the user is attempting to view
 * @returns An array of strings indicating what fields the user is able to see. *s indicate any field at that level
 */
function userViewableFields(myUser: MyUserDocument, doc?: CampaignDocument): string[] {
  if (!doc) { return []; }

  // Is owner check
  if (doc.ownedBy?.id === myUser.id) { return ["*"]; }

  // If a player, return the user view fields
  doc.players?.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return USER_VIEW_FIELDS; }
  });

  // Edge case
  // TODO - can campaigns be public? Or should pre-generated campaigns be their own document type?
  return [];
}
