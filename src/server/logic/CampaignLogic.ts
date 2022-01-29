
import { AnyDocument, CampaignDocument } from "types/documents";
import { isOwner } from "server/logic/security";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, Index, Update } from "@owl-factory/database/decorators/crud";
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
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create("createCampaign")
  @ReadFields(["*"])
  @SetFields(["*"])
  public async createOne(doc: Partial<CampaignDocument>): Promise<CampaignDocument> {
    const createdDoc = await fauna.createOne<CampaignDocument>(this.collection, doc);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The campaign could not be created.`};
    }
    return createdDoc;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteMyCampaign")
  public async deleteMyCampaign(ref: Ref64) {
    const deletedDoc = await fauna.deleteOne<CampaignDocument>(ref);
    if (deletedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return deletedDoc;
  }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch("viewMyCampaign")
  @Access(isPlayer)
  @RequireLogin()
  @ReadFields(["*"])
  public async findMyCampaign(id: Ref64): Promise<CampaignDocument> {
    const readDoc = await fauna.findByID<CampaignDocument>(id);
    if (readDoc === undefined) { throw { code: 404, message: `A document with ID ${id} could not be found` }; }
    return readDoc;
  }

  /**
   * Finds many documents
   * @param refs A list of document refs to fetch
   * @returns An array of found documents
   */
  public async findManyOfMyCampaigns(refs: Ref64[]) {
    const promises: Promise<Partial<CampaignDocument>>[] = [];
    refs.forEach((ref: Ref64) => {
      promises.push(this.findMyCampaign(ref));
    });
    const readDocs = await Promise.all(promises);
    return readDocs;
  }

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
  public async updateMyCampaign(ref: Ref64, doc: Partial<CampaignDocument>) {
    const updatedDoc = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (updatedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return updatedDoc;
  }

  /**
   * Updates any single campaign
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
   @Update("editAnyCampaign")
   @ReadFields(["*"])
   @SetFields(["*"])
   public async updateAnyCampaign(ref: Ref64, doc: Partial<CampaignDocument>) {
     const updatedDoc = await fauna.updateOne(ref, doc);
     // TODO - better message
     if (updatedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
     return updatedDoc;
   }

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
  @Index("viewCampaignsByUser")
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
  @Index("viewMyCampaigns")
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
