
import * as fauna from "@owl-factory/database/integration/fauna";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { Search } from "@owl-factory/database/decorators/decorators";
import { Collection, FaunaIndex } from "src/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { ActorSheetDocument } from "types/documents/ActorSheet";

const collection = Collection.ActorSheets;

class $ActorSheetLogic {
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
