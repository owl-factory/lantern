import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import * as fauna from "database/integration/fauna";
import { Fetch, FetchMany } from "database/decorators/crud";
import { Access, ReadFields } from "database/decorators/modifiers";
import { UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "types";
import { Collection } from "fauna";

class $ContentTypeLogic implements DatabaseLogic<ContentTypeDocument> {
  public collection = Collection.ContentTypes;

  @Fetch
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findByID(id: Ref64): Promise<ContentTypeDocument> {
    const contentType = await fauna.findByID<ContentTypeDocument>(id);
    if (contentType === undefined) { throw { code: 404, message: `The content type with id ${id} could not be found.`};}
    return contentType;
  }

  @FetchMany
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<ContentTypeDocument[]> {
    const contentTypes = await fauna.findManyByIDs<ContentTypeDocument>(ids);
    return contentTypes;
  }
}

export const ContentTypeLogic = new $ContentTypeLogic();

const ContentTypeLogicBuilder = new FaunaLogicBuilder("contentTypes")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest([])
    .user(["*"])
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(true)
    .admin(true)
  .done()

  /**
   * Initializes the fetch function from defaults
   */
  .fetch()
  .done()

  /**
   * Creates a function for fetching many campaign documents at once. It should use the same
   * logic and security as the ordinary fetch fucntion
   */
  .fetchMany()
  .done()
.done();
// export const ContentTypeLogic = ContentTypeLogicBuilder.export();
