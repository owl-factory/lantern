
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { RulesetDocument } from "types/documents";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import * as access from "./access";

const collection = Collection.Rulesets;
class $RulesetLogic {
  public collection = Collection.Rulesets;

  /**
   * Creates a single new ruleset document
   * @param doc The document partial to create
   * @returns The new ruleset document
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    return await access.create(collection, doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async delete(ref: Ref64) {
    return await access.remove(collection, ref);
  }

  /**
   * Fetches one ruleset from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The ruleset document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<RulesetDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Updates a single ruleset
   * @param ref The Ref64 ID of the document to update
   * @param doc The ruleset partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async updateOfficialRulesetIsPublic(ref: Ref64, doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Fetches the partial ruleset documents by their official status
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search(["*"])
  public async searchRulesetsByOfficial(isOfficial: boolean, options?: FaunaIndexOptions) {
    const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficial, [isOfficial], options);
    return rulesets;
  }

  /**
   * Fetches the partial ruleset documents by their official status
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
   @Search(["*"])
   public async searchRulesetsByOfficialPublic(isOfficial: boolean, isPublic: boolean, options?: FaunaIndexOptions) {
     const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficialPublic, [isOfficial, isPublic], options);
     return rulesets;
   }

}

export const RulesetLogic = new $RulesetLogic();
