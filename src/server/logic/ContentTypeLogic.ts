import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/utilities/decorators/decorators";
import { ContentTypeDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";
import { Collection, FaunaIndex } from "src/fauna";
import * as access from "./access";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import * as fauna from "@owl-factory/database/utilities/integration/fauna";

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

  /**
   * Fetches a list of all content types
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
   @Search(["*"])
   public async searchAllContentTypes(options?: FaunaIndexOptions) {
     const contentTypes = fauna.searchByIndex(FaunaIndex.AllContentTypes, [], options);
     return contentTypes;
   }
}

export const ContentTypeLogic = new $ContentTypeLogic();
