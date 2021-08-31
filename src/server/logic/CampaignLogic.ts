
import { Expr } from "faunadb";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { CampaignDocument, UserDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner } from "./security";

const USER_VIEW_FIELDS = [
  "banner.*",
  "ruleset.*",
  "players.*",
  "lastPlayedAt",
];
const CampaignLogicBuilder = new FaunaLogicBuilder("campaigns")
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

  /**
   * Allows for specifically updating the campaign banner
   */
  .update("updateBanner")
    .roles()
      .user(isOwner)
      .admin(true)
    .done()
    .setFields()
      .user(["banner.ref", "banner.src"])
    .done()
  .done()

  /**
   * Allows for searching through all of a user's campaigns from last played to oldest played
   * The index fields allow for base data to populate tiles
   */
  .search("fetchMyCampaigns", "my_campaigns_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["lastPlayedAt", "ref", "name", "banner.src"])
    // Explicitly allow the user since the index guarantees ownership/playing
    .roles()
      .user(true)
    .done()
  .done()

.done();
export const CampaignLogic = CampaignLogicBuilder.export();

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
