import * as fauna from "@owl-factory/database/integration/fauna";
import { Fetch, FetchMany } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields } from "@owl-factory/database/decorators/modifiers";
import { UserRole } from "@owl-factory/auth/enums";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";


class $ContentTypeLogic extends DatabaseLogic<ContentTypeDocument> {
  public collection = Collection.ContentTypes;

  /**
   * Fetches one content type from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content type document
   */
  @Fetch
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<ContentTypeDocument> {
    const contentType = await fauna.findByID<ContentTypeDocument>(id);
    if (contentType === undefined) { throw { code: 404, message: `The content type with id ${id} could not be found.`};}
    return contentType;
  }

  /**
   * Fetches many content types from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed content type documents
   */
  @FetchMany
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<ContentTypeDocument[]> {
    const contentTypes = await fauna.findManyByIDs<ContentTypeDocument>(ids);
    return contentTypes;
  }
}

export const ContentTypeLogic = new $ContentTypeLogic();
