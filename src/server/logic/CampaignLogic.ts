
import { CampaignDocument } from "types/documents";
import * as fauna from "@owl-factory/database/integration/fauna";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { Ref64 } from "@owl-factory/types";
import { Collection, FaunaIndex } from "src/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";
import * as access from "./access";

const collection = Collection.Campaigns;

class $CampaignLogic {
  public collection = collection;

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<CampaignDocument>): Promise<CampaignDocument> {
    return await access.create(collection, doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async delete(ref: Ref64) { return await access.remove(this.collection, ref); }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch(Collection.Campaigns, ["*"])
  @RequireLogin()
  public async fetch(ref: Ref64): Promise<CampaignDocument> { return access.fetch(collection, ref); }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<CampaignDocument>) { return await access.update(collection, ref, doc); }

  /**
   * Updates the banner image for a campaign
   * @param id The Ref64 ID of the document to update
   * @param doc The campaign partial with a new banner ID and src
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async updateBanner(id: Ref64, doc: Partial<CampaignDocument>) {
    const campaign = await fauna.updateOne<CampaignDocument>(id, doc);
    return campaign;
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search(["*"])
  @RequireLogin()
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
  @Search(["*"])
  @RequireLogin()
  public async fetchMyCampaigns(options?: FaunaIndexOptions) {
    const id = Auth.user?.ref;
    if (!id) { return []; }
    const campaigns = fauna.searchByIndex<Partial<CampaignDocument>>(FaunaIndex.CampaignsByUser, [id], options);
    return campaigns;
  }
}

export const CampaignLogic = new $CampaignLogic();
