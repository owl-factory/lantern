
import * as fauna from "@owl-factory/database/utilities/integration/fauna";
import { RequireLogin } from "@owl-factory/database/utilities/decorators/modifiers";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/utilities/decorators/decorators";
import { Collection, FaunaIndex } from "src/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { Ref64 } from "@owl-factory/types";
import * as access from "./access";

const collection = Collection.ActorSheets;

class $ActorSheetLogic {

  /**
   * Creates a single new actor sheet document
   * @param doc The document partial to create
   * @returns The new actor sheet document
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<ActorSheetDocument>): Promise<ActorSheetDocument> {
    return await access.create(collection, doc);
  }

  /**
   * Deletes a single actor sheet, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async delete(ref: Ref64) { return await access.remove(collection, ref); }

  /**
   * Fetches one actor sheet from its ref
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch(collection, ["*"])
  @RequireLogin()
  public async fetch(ref: Ref64): Promise<ActorSheetDocument> { return access.fetch(collection, ref); }

  /**
   * Updates a single actor sheet
   * @param ref The Ref64 ID of the document to update
   * @param doc The actor sheet partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<ActorSheetDocument>): Promise<ActorSheetDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search(["*"])
  @RequireLogin()
  public async searchAllActorSheets(options?: FaunaIndexOptions): Promise<Partial<ActorSheetDocument>[]> {
    const actorSheets = await fauna.searchByIndex(FaunaIndex.AllActorSheets, [], options);
    return actorSheets as Partial<ActorSheetDocument>[];
  }
}

export const ActorSheetLogic = new $ActorSheetLogic();
