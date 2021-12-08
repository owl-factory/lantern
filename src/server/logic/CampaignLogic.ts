
import { AnyDocument, CampaignDocument, UserDocument } from "types/documents";
import { isOwner } from "server/logic/security";
import { UserRole } from "types/security";
import * as fauna from "database/integration/fauna";
import { Access, ReadFields, RequireLogin, SetFields } from "src/database/decorators/modifiers";
import { Fetch, FetchMany, Index, Update } from "src/database/decorators/crud";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { SecurityController } from "controllers/security";
import { FaunaIndexOptions } from "types/fauna";
import { Ref64 } from "types";
import { Collection, FaunaIndex } from "fauna";
import { toRef } from "database/conversion/fauna/to";

/**
 * Checks if the current user is a player for the given document
 * @param doc The document to if the current user is a player of
 * @returns True if the current user is a player
 */
function isPlayer(doc?: AnyDocument): boolean {
  if (doc === undefined) { return false; }
  if (isOwner(doc)) { return true; }
  if (!("players" in doc) || doc.players === undefined) { return false; }
  let success = false;
  doc.players.forEach((player: { ref: Ref64 }) => {
    if (SecurityController.currentUser?.ref === player.ref) { success = true; }
  });
  return success;
}

class $CampaignLogic implements DatabaseLogic<CampaignDocument> {
  public collection = Collection.Campaigns;

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
  @SetFields(["banner.ref", "banner.src"])
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
    const ref = toRef(userID);
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
  @RequireLogin()
  @ReadFields(["*"])
  public async fetchMyCampaigns(options?: FaunaIndexOptions) {
    const id = SecurityController.currentUser?.ref;
    if (!id) { return []; }
    const campaigns = fauna.searchByIndex<Partial<CampaignDocument>>(FaunaIndex.CampaignsByUser, [id], options);
    return campaigns;
  }
}

export const CampaignLogic = new $CampaignLogic();
