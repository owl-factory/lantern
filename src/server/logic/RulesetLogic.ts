
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { RulesetDocument } from "types/documents";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, FetchMany, Search, Update } from "@owl-factory/database/decorators/decorators";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { isOwner } from "security/documents";

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
  public async create(doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    return await super.create(doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteMyRuleset")
  @Access(isOwner)
  public async delete(ref: Ref64) {
    return await super.delete(ref);
  }

  /**
   * Fetches one ruleset from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The ruleset document
   */
  @Fetch("viewAnyRuleset")
  @ReadFields(["*"])
  public async fetch(ref: Ref64): Promise<RulesetDocument> {
    return await super.fetch(ref);
  }

  /**
   * Updates a single ruleset
   * @param id The Ref64 ID of the document to update
   * @param doc The ruleset partial to update
   * @returns The new, updated document
   */
  @Update("editOfficialRuleset")
  @ReadFields(["*"])
  @SetFields(["isPublic"])
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
  @Search("searchRulesetsByOfficial")
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
   @Search("searchOfficialAndPublicRulesets")
   @ReadFields(["*"])
   public async searchRulesetsByOfficialPublic(isOfficial: boolean, isPublic: boolean, options?: FaunaIndexOptions) {
     const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficialPublic, [isOfficial, isPublic], options);
     return rulesets;
   }

}

export const RulesetLogic = new $RulesetLogic();
