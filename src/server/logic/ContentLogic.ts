
import { Create, Delete, Fetch, FetchMany, Search, Update } from "@owl-factory/database/decorators/decorators";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { AnyDocument, ContentDocument, RulesetDocument } from "types/documents";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";

class $ContentLogic extends DatabaseLogic<ContentDocument> {
  public collection = Collection.Contents;

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
  @Create("createContent")
  @ReadFields(["*"])
  @SetFields(["*"])
  public async createContent(
    content: Partial<ContentDocument>,
    ruleset: Partial<RulesetDocument>
  ): Promise<ContentDocument> {
    // TODO - ensure ruleset exists and the user has permission to update
    return await super.create(content);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteContent")
  @Access(isOwner)
  public async deleteMyContent(ref: Ref64) { return await super.delete(ref); }

  /**
   * Fetches one content from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content document
   */
  @Fetch("viewContent")
  @Access(userViewable)
  @ReadFields(userViewableFields)
  public async findContent(ref: Ref64): Promise<ContentDocument> { return await super.fetch(ref); }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update("updateMyContent")
  @Access(isOwner)
  @ReadFields(["*"])
  @SetFields(["*"])
  public async updateMyContent(ref: Ref64, doc: Partial<ContentDocument>) { return await super.update(ref, doc); }


  /**
   * Fetches the partial content documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of content document partials
   */
  @Search("searchContentByUser")
  @ReadFields(["*"])
  public async searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    return this._searchContentByUser(userID, options);
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Search("searchMyContent")
  @ReadFields(["*"])
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
}

export const ContentLogic = new $ContentLogic();

/**
 * Determines if a standard user is able to view any part of a document
 * @param myUser The current user attempting to view
 * @param doc The document the user is attempting to view
 * @returns True if the user may view any part of the document, false otherwise
 */
function userViewable(doc?: AnyDocument): boolean {
  if (!doc) { return false; }
  if (isOwner(doc)) { return true; }

  return false;
}

/**
 * Determines which fields a user has access to in a given document
 * @param myUser The user attempting to view the document
 * @param doc The document the user is attempting to view
 * @returns An array of strings indicating what fields the user is able to see. *s indicate any field at that level
 */
function userViewableFields(doc?: AnyDocument): string[] {
  if (!doc) { return []; }

  // Is owner check
  if (isOwner(doc)) { return ["*"]; }

  // Edge case
  // TODO - can campaigns be public? Or should pre-generated campaigns be their own document type?
  return [];
}
