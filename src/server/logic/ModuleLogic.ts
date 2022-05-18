
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { ModuleDocument } from "types/documents";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import * as fauna from "@owl-factory/database/integration/fauna";

import * as access from "./access";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";

const collection = Collection.Modules;
class $ModuleLogic {
  public collection = Collection.Modules;

  /**
   * Creates a single new ruleset document
   * @param doc The document partial to create
   * @returns The new ruleset document
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<ModuleDocument>): Promise<ModuleDocument> {
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
  public async fetch(ref: Ref64): Promise<ModuleDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Updates a single module
   * @param ref The Ref64 ID of the document to update
   * @param doc The ruleset partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["*"], (ref: Ref64) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<ModuleDocument>): Promise<ModuleDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Fetches a list of all modules
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search(["*"])
  public async searchAllModules(options?: FaunaIndexOptions) {
    const modules = fauna.searchByIndex(FaunaIndex.AllModules, [], options);
    return modules;
  }
}

export const ModuleLogic = new $ModuleLogic();
