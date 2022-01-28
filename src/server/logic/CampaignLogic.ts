
import { AnyDocument, CampaignDocument } from "types/documents";
import { isOwner } from "server/logic/security";
import { UserRole } from "@owl-factory/auth/enums";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Access, ReadFields, RequireLogin, Role, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Index, Update } from "@owl-factory/database/decorators/crud";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { Ref64 } from "@owl-factory/types";
import { Collection, FaunaIndex } from "src/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { SecurityController } from "controllers/SecurityController";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Auth } from "controllers/auth";

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

class $CampaignLogic extends DatabaseLogic<CampaignDocument> {
  public collection = Collection.Campaigns;

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
  @Role("viewMyCampaigns")
  @RequireLogin()
  @ReadFields(["*"])
  public async fetchMyCampaigns(options?: FaunaIndexOptions) {
    const id = Auth.getUser()?.ref;
    if (!id) { return []; }
    const campaigns = fauna.searchByIndex<Partial<CampaignDocument>>(FaunaIndex.CampaignsByUser, [id], options);
    return campaigns;
  }
}

export const CampaignLogic = new $CampaignLogic();
