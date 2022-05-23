
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { ContentDocument, RulesetDocument } from "types/documents";
import * as fauna from "@owl-factory/database/integration/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { Auth } from "controllers/auth";
import * as access from "./access";

const collection = Collection.Contents;

class $ContentLogic {

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create(["*"], ["*"])
  public async create(
    content: Partial<ContentDocument>
  ): Promise<ContentDocument> {
    // TODO - ensure ruleset exists and the user has permission to update
    return await access.create(collection, content);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async delete(ref: Ref64) { return await access.remove(collection, ref); }

  /**
   * Fetches one content from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<ContentDocument> { return await access.fetch(collection, ref); }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<ContentDocument>) {
    return await access.update(collection, ref, doc);
  }


  /**
   * Fetches the partial content documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of content document partials
   */
  @Search(["*"])
  public async searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    return this._searchContentByUser(userID, options);
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search(["*"])
  public async searchMyContent(options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    const userID = Auth.user?.ref;
    if (!userID) { return []; }
    return this._searchContentByUser(userID, options);
  }

  /**
   * Fetches the partial content documents for any given user for the content by user and my content functions
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  private async _searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    const userRef = toRef(userID);
    const content = await fauna.searchByIndex<ContentDocument>(FaunaIndex.ContentByUser, [userRef], options);

    return content;
  }

  /**
   * Fetches a list of all content types
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
   @Search(["*"])
   public async searchAllContents(options?: FaunaIndexOptions) {
     const contents = fauna.searchByIndex(FaunaIndex.AllContents, [], options);
     return contents;
   }
}

export const ContentLogic = new $ContentLogic();
