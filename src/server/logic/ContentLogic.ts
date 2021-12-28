
import { Fetch, FetchMany, Index } from "database/decorators/crud";
import { Access, ReadFields } from "database/decorators/modifiers";
import { Collection, FaunaIndex } from "fauna";
import { Ref64 } from "types";
import { AnyDocument, ContentDocument } from "types/documents";
import { UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { isOwner } from "./security";
import * as fauna from "database/integration/fauna";
import { FaunaIndexOptions } from "types/fauna";
import { SecurityController } from "controllers/security";
import { toRef } from "database/conversion/fauna/to";

class $ContentLogic extends DatabaseLogic<ContentDocument> {
  public collection = Collection.Contents;

  /**
   * Fetches one content from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The content document
   */
  @Fetch
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findOne(id: Ref64): Promise<ContentDocument> {
    const content = await fauna.findByID<ContentDocument>(id);
    if (content === undefined) { throw { code: 404, message: `The content with id ${id} could not be found`}; }
    return content;
  }

  /**
   * Fetches many contents from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed content documents
   */
  @FetchMany
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findManyByIDs(ids: Ref64[]): Promise<ContentDocument[]> {
    const contents = await fauna.findManyByIDs<ContentDocument>(ids);
    return contents;
  }


  /**
   * Fetches the partial content documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of content document partials
   */
  @Index
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    return this._searchContentByUser(userID, options);
  }

  /**
   * Fetches the partial campaign documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  @Index
  @Access({[UserRole.User]: true, [UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchMyContent(options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    const userID = SecurityController.currentUser?.ref;
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
