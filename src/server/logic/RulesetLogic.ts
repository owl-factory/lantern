
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { RulesetDocument } from "types/documents";
import { UserRole } from "@owl-factory/auth/enums";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, FetchMany, Index, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { isOwner } from "./security";

class $RulesetLogic extends DatabaseLogic<RulesetDocument> {
  public collection = Collection.Rulesets;

  /**
   * Creates a single new ruleset document
   * @param doc The document partial to create
   * @returns The new ruleset document
   */
  @Create("createOfficialRuleset")
  @ReadFields(["*"])
  @SetFields(["name", "isOfficial"])
  public async createOne(doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    const ruleset = await fauna.createOne<RulesetDocument>(this.collection, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while creating the document"};
    }
    return ruleset;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
   @Delete("deleteMyRuleset")
   @Access(isOwner)
   public async deleteOne(ref: Ref64) {
     const deletedDoc = await fauna.deleteOne<RulesetDocument>(ref);
     if (deletedDoc === undefined) { throw { code: 404, message: `The ruleset with id ${ref} could not be found.`}; }
     return deletedDoc;
   }

  /**
   * Fetches one ruleset from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The ruleset document
   */
  @Fetch("viewAnyRuleset")
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<RulesetDocument> {
    const ruleset = await fauna.findByID<RulesetDocument>(id);
    if (ruleset === undefined) { throw { code: 404, message: `A ruleset with ID ${id} could not be found` }; }
    return ruleset;
  }

  /**
   * Fetches many rulesets from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed ruleset documents
   */
  @FetchMany("viewAnyRuleset")
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<RulesetDocument[]> {
    const rulesets = await fauna.findManyByIDs<RulesetDocument>(ids);
    return rulesets;
  }

  /**
   * Updates a single ruleset
   * @param id The Ref64 ID of the document to update
   * @param doc The ruleset partial to update
   * @returns The new, updated document
   */
  @Update("editOfficialRuleset")
  @ReadFields({[UserRole.Admin]: ["*"]})
  @SetFields({[UserRole.Admin]: ["isPublic"]})
  public async updateOfficialRulesetIsPublic(id: Ref64, doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    const ruleset = await fauna.updateOne(id, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while updating the document"};
    }
    return ruleset;
  }

  /**
   * Fetches the partial ruleset documents by their official status
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Index("searchRulesetsByOfficial")
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchRulesetsByOfficial(isOfficial: boolean, options?: FaunaIndexOptions) {
    const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficial, [isOfficial], options);
    return rulesets;
  }

  /**
   * Fetches the partial ruleset documents by their official status
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
   @Index("searchOfficialAndPublicRulesets")
   @ReadFields(["*"])
   public async searchRulesetsByOfficialPublic(isOfficial: boolean, isPublic: boolean, options?: FaunaIndexOptions) {
     const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficialPublic, [isOfficial, isPublic], options);
     return rulesets;
   }

}

export const RulesetLogic = new $RulesetLogic();
