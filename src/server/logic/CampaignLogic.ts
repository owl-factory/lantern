
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { AnyDocument, CampaignDocument, UserDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner_old } from "./security";
import { query as q } from "faunadb";

const USER_VIEW_FIELDS = [
  "banner.*",
  "ruleset.*",
  "players.*",
  "lastPlayedAt",
];

import { isOwner } from "server/logic/security";
import { UserRole } from "types/security";
import * as fauna from "src/database/fauna";
import { FaunaIndex, Ref64 } from "src/database/fauna";
import { Access, ReadFields, RequireLogin, SetFields } from "src/database/decorators/modifiers";
import { Fetch, FetchMany, Index, Update } from "src/database/decorators/crud";
import { Collection, DatabaseLogic } from "./AbstractDatabaseLogic";
import { SecurityController } from "controllers/security";
import { Expr } from "faunadb";
import { decode } from "utilities/encoding";
import { FaunaIndexOptions } from "types/fauna";

function isPlayer(doc?: AnyDocument): boolean {
  if (doc === undefined) { return false; }
  if (isOwner(doc)) { return true; }
  if (!("players" in doc) || doc.players === undefined) { return false; }
  let success = false;
  doc.players.forEach((player: UserDocument) => {
    if (SecurityController.currentUser?.id === player.id) { success = true; }
  });
  return success;
}

class $CampaignLogic implements DatabaseLogic<CampaignDocument> {
  public collection = Collection.Campaign;

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch
  @Access({[UserRole.User]: isPlayer, [UserRole.Admin]: true})
  @RequireLogin()
  public async findByID(id: Ref64): Promise<CampaignDocument> {
    const campaign = await fauna.findByID<CampaignDocument>(id);
    if (campaign === undefined) { throw { code: 404, message: `A campaign with ID ${id} could not be found` }; }
    return campaign;
  }

  /**
   * Fetches many campaigns from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed campaign documents
   */
  @FetchMany
  @Access({[UserRole.User]: isPlayer, [UserRole.Admin]: true})
  @RequireLogin()
  public async findManyByIDs(ids: Ref64[]): Promise<CampaignDocument[]> {
    const campaigns = await fauna.findManyByIDs<CampaignDocument>(ids);
    return campaigns;
  }

  /**
   * Updates the banner image for a campaign
   * @param id The Ref64 ID of the document to update
   * @param doc The campaign partial with a new banner ID and src
   * @returns The new, updated document
   */
  @Update
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @RequireLogin()
  @SetFields(["banner.id", "banner.src"])
  public async updateBanner(id: Ref64, doc: Partial<CampaignDocument>) {
    const campaign = await fauna.updateOne<CampaignDocument>(id, doc);
    return campaign;
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Index
  @Access({[UserRole.Admin]: true})
  @RequireLogin()
  @ReadFields(["*"])
  public async fetchCampaignsByUser(userID: Ref64, options?: FaunaIndexOptions) {
    const ref = fauna.idToRef(userID);
    const campaigns = fauna.searchByIndex(FaunaIndex.CampaignsByUser, [ref], options);
    return campaigns;
  }

  /**
   * Fetches the partial campaign documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Index
  @Access({[UserRole.User]: true})
  // @RequireLogin()
  @ReadFields(["*"])
  public async fetchMyCampaigns(options?: FaunaIndexOptions) {
    console.log(2)
    const id = SecurityController.currentUser?.id;
    console.log(3)

    if (!id) { return []; }
    const ref = fauna.idToRef(id);
    const campaigns = fauna.searchByIndex<Partial<CampaignDocument>>(FaunaIndex.CampaignsByUser, [ref], options);
    return campaigns;
  }

}

export const CampaignLogic = new $CampaignLogic();


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
      .user(isOwner_old as any)
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
// export const CampaignLogic = CampaignLogicBuilder.export();

/**
 * Determines if a standard user is able to view any part of a document
 * @param myUser The current user attempting to view
 * @param doc The document the user is attempting to view
 * @returns True if the user may view any part of the document, false otherwise
 */
function userViewable(myUser: MyUserDocument, doc?: AnyDocument): boolean {
  if (!doc) { return false; }
  if (doc.ownedBy?.id === myUser.id) { return true; }
  (doc as CampaignDocument).players?.forEach((player: UserDocument) => {
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
function userViewableFields(myUser: MyUserDocument, doc?: AnyDocument): string[] {
  if (!doc) { return []; }

  // Is owner check
  if (doc.ownedBy?.id === myUser.id) { return ["*"]; }

  // If a player, return the user view fields
  (doc as CampaignDocument).players?.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return USER_VIEW_FIELDS; }
  });

  // Edge case
  // TODO - can campaigns be public? Or should pre-generated campaigns be their own document type?
  return [];
}
