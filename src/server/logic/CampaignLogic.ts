
import { CampaignDocument } from "types/documents";
import * as fauna from "@owl-factory/database/integration/fauna";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { Ref64 } from "@owl-factory/types";
import { Collection, FaunaIndex } from "src/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Auth } from "controllers/auth";
import { isPlayer } from "security/documents/campaigns";
import { isOwner } from "security/documents";



class $CampaignLogic extends DatabaseLogic<CampaignDocument> {
  public collection = Collection.Campaigns;

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<CampaignDocument>): Promise<CampaignDocument> { return await super.create(doc); }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteMyCampaign")
  public async delete(ref: Ref64) { return await super.delete(ref); }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch(Collection.Campaigns, "viewMyCampaign")
  @Access(isPlayer)
  @RequireLogin()
  @ReadFields(["*"])
  public async fetch(ref: Ref64): Promise<CampaignDocument> { return super.fetch(ref); }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update("editMyCampaign")
  @Access(isOwner)
  @ReadFields(["*"])
  @SetFields(["*"])
  public async update(ref: Ref64, doc: Partial<CampaignDocument>) { return await super.update(ref, doc); }

  /**
   * Updates the banner image for a campaign
   * @param id The Ref64 ID of the document to update
   * @param doc The campaign partial with a new banner ID and src
   * @returns The new, updated document
   */
  @Update("editMyCampaign")
  @Access(isOwner)
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
  @Search("viewCampaignsByUser")
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
  @Search("viewMyCampaigns")
  @RequireLogin()
  @ReadFields(["*"])
  public async fetchMyCampaigns(options?: FaunaIndexOptions) {
    const id = Auth.user?.ref;
    if (!id) { return []; }
    const campaigns = fauna.searchByIndex<Partial<CampaignDocument>>(FaunaIndex.CampaignsByUser, [id], options);
    return campaigns;
  }
}

export const CampaignLogic = new $CampaignLogic();
