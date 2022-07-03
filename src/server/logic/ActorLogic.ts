
import * as fauna from "@owl-factory/database/integration/fauna";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { Search } from "@owl-factory/database/decorators/decorators";
import { Collection, FaunaIndex } from "src/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { ActorDocument } from "types/documents/Actor";

const collection = Collection.Actors;

class $ActorLogic {
  /**
   * Fetches the partial actor documents
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of actor document partials
   */
  @Search(["*"])
  @RequireLogin()
  public async searchAllActors(options?: FaunaIndexOptions): Promise<Partial<ActorDocument>[]> {
    const actors = await fauna.searchByIndex(FaunaIndex.AllActors, [], options);
    return actors as Partial<ActorDocument>[];
  }
}

export const ActorLogic = new $ActorLogic();
