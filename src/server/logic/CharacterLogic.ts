import { Ref64 } from "@owl-factory/types";
import * as fauna from "@owl-factory/database/integration/fauna";
import { CharacterDocument } from "types/documents";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { Collection, FaunaIndex } from "src/fauna";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Auth } from "controllers/auth";
import * as access from "./access";


const collection = Collection.Characters;

class $CharacterLogic extends DatabaseLogic<CharacterDocument> {
  public collection = collection;

  /**
   * Creates a single character
   * @param doc The character document to create
   * @returns The created character, if successful
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<CharacterDocument>): Promise<CharacterDocument> {
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
   * Fetches one character from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The character document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<CharacterDocument> { return await access.fetch(collection, ref); }

  /**
   * Updates the character document
   * @param ref The ref of the document to update
   * @param doc The new document partial to patch onto the old document
   * @returns The updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async updateMyCharacter(ref: Ref64, doc: Partial<CharacterDocument>) {
    return await access.update(collection, ref, doc);
  }

  /**
   * Fetches the partial character documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of character document partials
   */
  @Search(["*"])
  public async searchCharactersByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    return this._searchCharactersByUser(userID, options);
  }

  /**
   * Fetches the partial character documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of character document partials
   */
  @Search(["*"])
  public async searchMyCharacters(options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    const userID = Auth.user?.ref;
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

