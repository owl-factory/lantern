
import { Create, Delete, Fetch, FetchMany, Index, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Collection, FaunaIndex } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { AnyDocument, ContentDocument, RulesetDocument } from "types/documents";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { isOwner } from "./security";
import * as fauna from "@owl-factory/database/integration/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { Auth } from "controllers/auth";

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
    // TODO - add checks to verify that the user can create this content
    const createdDoc = await fauna.createOne<ContentDocument>(this.collection, content);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The content could not be created.`};
    }
    return createdDoc;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteContent")
  @Access(isOwner)
  public async deleteMyContent(ref: Ref64, content: Partial<ContentDocument>) {
    const deletedDoc = await fauna.deleteOne<ContentDocument>(ref);
    if (deletedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return deletedDoc;
  }

  /**
   * Fetches one content from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content document
   */
  @Fetch("viewContent")
  @Access(userViewable)
  @ReadFields(userViewableFields)
  public async findContent(id: Ref64): Promise<ContentDocument> {
    const content = await fauna.findByID<ContentDocument>(id);
    if (content === undefined) { throw { code: 404, message: `The content with id ${id} could not be found`}; }
    return content;
  }

  /**
   * Fetches many contents from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed content documents
   */
  @FetchMany("viewContent")
  @Access(userViewable)
  @ReadFields(userViewableFields)
  public async findManyByIDs(ids: Ref64[]): Promise<ContentDocument[]> {
    const contents = await fauna.findManyByIDs<ContentDocument>(ids);
    return contents;
  }

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
  public async updateMyContent(ref: Ref64, doc: Partial<ContentDocument>) {
    const updatedDoc = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (updatedDoc === undefined) {
      throw { code: 404, message: `The content document with id ${ref} could not be found.`};
    }
    return updatedDoc;
  }


  /**
   * Fetches the partial content documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of content document partials
   */
  @Index("searchContentByUser")
  @ReadFields(["*"])
  public async searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    return this._searchContentByUser(userID, options);
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Index("searchMyContent")
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
