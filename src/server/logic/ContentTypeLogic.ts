import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, FetchMany, Update } from "@owl-factory/database/decorators/decorators";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";
import { isOwner } from "security/documents";


class $ContentTypeLogic extends DatabaseLogic<ContentTypeDocument> {
  public collection = Collection.ContentTypes;

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create("createContentType")
  @ReadFields(["*"])
  @SetFields(["*"])
  public async create(doc: Partial<ContentTypeDocument>): Promise<ContentTypeDocument> { 
    // TODO - ensure that user can access parent ruleset
    return await super.create(doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteMyContentType")
  @Access(isOwner)
  public async delete(ref: Ref64) {
    return await super.delete(ref);
  }

  /**
   * Fetches one content type from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content type document
   */
  @Fetch("viewContentType")
  @ReadFields(["*"])
  public async fetch(ref: Ref64): Promise<ContentTypeDocument> {
    return await super.fetch(ref);
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
   @Update("updateMyContentType")
   @Access(isOwner)
   @ReadFields(["*"])
   @SetFields(["*"])
   public async update(ref: Ref64, doc: Partial<ContentTypeDocument>) {
    return await super.update(ref, doc);
  }
}

export const ContentTypeLogic = new $ContentTypeLogic();
