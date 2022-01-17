import { Ref64 } from "@owl-factory/types";
import * as fauna from "@owl-factory/database/integration/fauna";
import { AnyDocument, CharacterDocument } from "types/documents";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { isOwner } from "./security";
import { Collection, FaunaIndex } from "src/fauna";
import { Create, Delete, Fetch, FetchMany, Index, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { SecurityController } from "controllers/SecurityController";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { UserRole } from "@owl-factory/auth/enums";

const PUT_FIELDS = ["*"];

class $CharacterLogic extends DatabaseLogic<CharacterDocument> {
  public collection = Collection.Characters;

  /**
   * Creates a single character
   * @param doc The character document to create
   * @returns The created character, if successful
   */
  @Create
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  @SetFields(PUT_FIELDS)
  public async createOne(doc: Partial<CharacterDocument>): Promise<CharacterDocument> {
    const character = await fauna.createOne<CharacterDocument>(this.collection, doc);

    if (character === undefined) {
      throw { code: 500, message: `The character could not be created.`};
    }
    return character;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete
  @Access({[UserRole.User]: true})
  public async deleteOne(ref: Ref64) {
    const character = await fauna.deleteOne<CharacterDocument>(ref);
    if (character === undefined) { throw { code: 404, message: `The character with id ${ref} could not be found.`}; }
    return character;
  }

  /**
   * Fetches one character from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The character document
   */
  @Fetch
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findOne(id: Ref64): Promise<CharacterDocument> {
    const character = await fauna.findByID<CharacterDocument>(id);
    if (character === undefined) { throw { code: 404, message: `The character with id ${id} could not be found.`}; }
    return character;
  }

  /**
   * Updates the character document
   * @param ref The ref of the document to update
   * @param doc The new document partial to patch onto the old document
   * @returns The updated document
   */
  @Update
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  @SetFields(["*"])
  public async updateOne(ref: Ref64, doc: Partial<CharacterDocument>) {
    const character = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (character === undefined) { throw { code: 404, message: `The character with id ${ref} could not be found.`}; }
    return character;
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
    const userID = SecurityController.currentUser?.ref;
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

