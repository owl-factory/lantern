import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/decorators";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";
import * as access from "./access";

const collection = Collection.ContentTypes;

class $ContentTypeLogic {
  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<ContentTypeDocument>): Promise<ContentTypeDocument> { 
    // TODO - ensure that user can access parent ruleset
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
   * Fetches one content type from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content type document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<ContentTypeDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
   @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
   public async update(ref: Ref64, doc: Partial<ContentTypeDocument>) {
    return await access.update(collection, ref, doc);
  }
}

export const ContentTypeLogic = new $ContentTypeLogic();
