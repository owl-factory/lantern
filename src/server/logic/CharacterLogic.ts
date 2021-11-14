import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { Ref64 } from "types";
import * as fauna from "database/integration/fauna";
import { AnyDocument, CharacterDocument } from "types/documents";
import { MyUserDocument, UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner, isOwner_old } from "./security";
import { Collection, FaunaIndex } from "fauna";
import { Fetch, FetchMany, Index } from "database/decorators/crud";
import { Access, ReadFields } from "database/decorators/modifiers";
import { FaunaIndexOptions } from "types/fauna";
import { SecurityController } from "controllers/security";

const USER_VIEW_FIELDS = [];

class $CharacterLogic implements DatabaseLogic<CharacterDocument> {
  public collection = Collection.Characters;

  @Fetch
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findByID(id: Ref64): Promise<CharacterDocument> {
    const character = await fauna.findByID<CharacterDocument>(id);
    if (character === undefined) { throw { code: 404, message: `The character with id ${id} could not be found.`}; }
    return character;
  }

  @FetchMany
  @Access({[UserRole.User]: userViewable, [UserRole.Admin]: true})
  @ReadFields({[UserRole.User]: userViewableFields, [UserRole.Admin]: ["*"]})
  public async findManyByIDs(ids: Ref64[]): Promise<CharacterDocument[]> {
    const characters = await fauna.findManyByIDs<CharacterDocument>(ids);
    return characters;
  }

  @Index
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchCharactersByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    return this._searchCharactersByUser(userID, options);
  }

  @Index
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async searchMyCharacters(options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    const userID = SecurityController.currentUser?.id;
    if (!userID) { return []; }
    return this._searchCharactersByUser(userID, options);
  }

  private async _searchCharactersByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<CharacterDocument[]> {
    const characters = await fauna.searchByIndex<CharacterDocument>(FaunaIndex.CharactersByUser, [userID], options);
    return characters;
  }
}

export const CharacterLogic = new $CharacterLogic();

const CharacterLogicBuilder = new FaunaLogicBuilder("characters")
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

  .fetchMany()
  .done()

  /**
   * Allows for searching through all of a user's campaigns from last played to oldest played
   * The index fields allow for base data to populate tiles
   */
   .search("fetchMyCharacters", "my_characters_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["updatedAt", "ref", "name", "ruleset.ref", "campaign.ref", "profile.src"])
    // Explicitly allow the user since the index guarantees ownership/playing
    .roles()
      .user(true)
    .done()
  .done()
.done();

function userViewableFields(doc?: AnyDocument) {
  if (isOwner(doc)) { return ["*"]; }
  return [];
}

function userViewable(doc?: AnyDocument) {
  if (isOwner(doc)) { return true; }
  return false;
}

// export const CharacterLogic = CharacterLogicBuilder.export();
