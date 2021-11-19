import { Ref64 } from "types";
import * as fauna from "database/integration/fauna";
import { AnyDocument, CharacterDocument } from "types/documents";
import { UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { isOwner } from "./security";
import { Collection, FaunaIndex } from "fauna";
import { Fetch, FetchMany, Index } from "database/decorators/crud";
import { Access, ReadFields } from "database/decorators/modifiers";
import { FaunaIndexOptions } from "types/fauna";
import { SecurityController } from "controllers/security";

class $CharacterLogic implements DatabaseLogic<CharacterDocument> {
  public collection = Collection.Characters;

  /**
   * Fetches one character from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The character document
   */
  @Fetch
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findByID(id: Ref64): Promise<CharacterDocument> {
    const character = await fauna.findByID<CharacterDocument>(id);
    if (character === undefined) { throw { code: 404, message: `The character with id ${id} could not be found.`}; }
    return character;
  }

  /**
   * Fetches many characters from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed character documents
   */
  @FetchMany
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findManyByIDs(ids: Ref64[]): Promise<CharacterDocument[]> {
    const characters = await fauna.findManyByIDs<CharacterDocument>(ids);
    return characters;
  }

  /**
   * Fetches the partial character documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of character document partials
   */
  @Index
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchCharactersByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    return this._searchCharactersByUser(userID, options);
  }

  /**
   * Fetches the partial character documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of character document partials
   */
  @Index
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async searchMyCharacters(options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    const userID = SecurityController.currentUser?.id;
    if (!userID) { return []; }
    return this._searchCharactersByUser(userID, options);
  }

  /**
   * Fetches the partial campaign documents for any given user for the my characters and characters by user functions
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  private async _searchCharactersByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    const characters = await fauna.searchByIndex<CharacterDocument>(FaunaIndex.CharactersByUser, [userID], options);
    return characters;
  }
}

export const CharacterLogic = new $CharacterLogic();


function userViewableFields(doc?: AnyDocument) {
  if (isOwner(doc)) { return ["*"]; }
  return [];
}

function userViewable(doc?: AnyDocument) {
  if (isOwner(doc)) { return true; }
  return false;
}

