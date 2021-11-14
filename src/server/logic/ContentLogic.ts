
import { Fetch, FetchMany, Index } from "database/decorators/crud";
import { Access, ReadFields } from "database/decorators/modifiers";
import { Collection, FaunaIndex } from "fauna";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { Ref64 } from "types";
import { AnyDocument, CampaignDocument, ContentDocument } from "types/documents";
import { MyUserDocument, UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner, isOwner_old } from "./security";
import * as fauna from "database/integration/fauna";
import { FaunaIndexOptions } from "types/fauna";
import { SecurityController } from "controllers/security";

class $ContentLogic implements DatabaseLogic<ContentDocument> {
  public collection = Collection.Contents;

  @Fetch
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findByID(id: Ref64): Promise<ContentDocument> {
    const content = await fauna.findByID<ContentDocument>(id);
    if (content === undefined) { throw { code: 404, message: `The content with id ${id} could not be found`}; }
    return content;
  }

  @FetchMany
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findManyByIDs(ids: Ref64[]): Promise<ContentDocument[]> {
    const contents = await fauna.findManyByIDs<ContentDocument>(ids);
    return contents;
  }


  @Index
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchntByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    return this._searchContentByUser(userID, options);
  }

  @Index
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchMyContent(options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    const userID = SecurityController.currentUser?.id;
    if (!userID) { return []; }
    return this._searchContentByUser(userID, options);
  }

  private async _searchContentByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ContentDocument[]> {
    const content = await fauna.searchByIndex<ContentDocument>(FaunaIndex.ContentByUser, [userID], options);
    return content;
  }
}



const ContentLogicBuilder = new FaunaLogicBuilder("contents")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest([])
    .user(userViewableFields)
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(userViewable)
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

  .fetchMany("fetchManyMyContent")
    .roles()
      .guest(false)
      .user(isOwner_old)
      .admin(true)
    .done()
    .fields()
      .guest([])
      .user(["*"])
    .done()
  .done()

  /**
   * Allows for searching through all of a user's campaigns from last played to oldest played
   * The index fields allow for base data to populate tiles
   */
  .search("fetchMyContent", "my_content_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["updatedAt", "ref", "name", "type.ref", "ruleset.ref"])
    // Explicitly allow the user since the index guarantees ownership/playing
    .roles()
      .user(true)
    .done()
    .postProcess(postProcessMyContent)
  .done()

.done();
export const ContentLogic = ContentLogicBuilder.export();

/**
 * Updates a user's documents fetched using the my content index search
 * @param doc The document to update
 * @param myUser The current user fetching these documents
 * @returns The updated document
 */
function postProcessMyContent(doc: AnyDocument, myUser: MyUserDocument) {
  doc.ownedBy = {
    id: myUser.id,
    collection: myUser.collection,
  };
  return doc;
}

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
