import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, FetchMany, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";
import { isOwner } from "./security";


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
  public async createOne(doc: Partial<ContentTypeDocument>): Promise<ContentTypeDocument> {
    const createdDoc = await fauna.createOne<ContentTypeDocument>(this.collection, doc);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The content type could not be created.`};
    }
    return createdDoc;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteMyContentType")
  @Access(isOwner)
  public async deleteOne(ref: Ref64) {
    const deletedDoc = await fauna.deleteOne<ContentTypeDocument>(ref);
    if (deletedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return deletedDoc;
  }

  /**
   * Fetches one content type from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content type document
   */
  @Fetch("viewContentType")
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
  @FetchMany("viewContentType")
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<ContentTypeDocument[]> {
    const contentTypes = await fauna.findManyByIDs<ContentTypeDocument>(ids);
    return contentTypes;
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
   public async updateMyContentType(ref: Ref64, doc: Partial<ContentTypeDocument>) {
    const updatedDoc = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (updatedDoc === undefined) {
      throw { code: 404, message: `The content type document with id ${ref} could not be found.`};
    }
    return updatedDoc;
  }
}

export const ContentTypeLogic = new $ContentTypeLogic();
