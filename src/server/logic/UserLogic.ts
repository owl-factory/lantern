import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { Ref64 } from "types";
import { UserDocument } from "types/documents";
import { isOwner, isOwner_old } from "./security";
import * as fauna from "database/integration/fauna";
import { FaunaIndex } from "fauna";
import { UserRole } from "types/security";
import { Collection, DatabaseLogic } from "./AbstractDatabaseLogic";
import { Delete, Fetch, FetchMany, Index, Update } from "database/decorators/crud";
import { Access, ReadFields, SetFields } from "database/decorators/modifiers";
import { FaunaIndexOptions } from "types/fauna";

const guestFields = [
  "username",
  "name",
  "icon",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
  "badges",
];
const updateFields = [
  "name",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
];

class $UserLogic implements DatabaseLogic<UserDocument> {
  public collection = Collection.User;

  @Delete
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  public async delete(id: Ref64): Promise<UserDocument> {
    const user = await fauna.deleteOne<UserDocument>(id);
    if (user === undefined) { throw {code: 500, message: "An unexpected error occured while deleting the document"}; }
    return user;
  }


  @Fetch
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findByID(id: Ref64): Promise<UserDocument> {
    const user = await fauna.findByID<UserDocument>(id);
    if (user === undefined) { throw { code: 404, message: `A user with ID ${id} could not be found` }; }
    return user;
  }

  @FetchMany
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<UserDocument[]> {
    const users = await fauna.findManyByIDs<UserDocument>(ids);
    return users;
  }

  @Index
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findByUsername(username: string, options?: FaunaIndexOptions): Promise<UserDocument[]> {
    const users = await fauna.searchByIndex<UserDocument>(FaunaIndex.UsersByUsername, [username], options);
    return users;
  }

  @Update
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields(["*"])
  @SetFields({[UserRole.User]: updateFields})
  public async updateOne(id: Ref64, doc: Partial<UserDocument>): Promise<UserDocument> {
    const user = await fauna.updateOne<UserDocument>(id, doc);
    if (user === undefined) { 
      throw { code: 500, message: "An unexpected error occured while attepting to update the user."};
    }
    return user;
  }
}

export const UserLogic = new $UserLogic();

const UserLogicBuilder = new FaunaLogicBuilder("users");
export const UserLogic_old = UserLogicBuilder
  // Globals
  .fields()
    .guest(guestFields)
    .user(["*"]) // TODO
    .admin(["*"])
  .done()
  .roles()
    .admin(true)
  .done()

  /**
   * Disables the delete functionality for users. Users cannot be deleted, as they are far too complex,
   * but we can disable them and retire them in the future using specific functions
   */
  .delete()
    .roles()
      .admin(false)
    .done()
  .done()

  /**
   * Initializes the fetch function. Guests and above can view. The fields allowed are inherited.
   */
  .fetch()
    .roles()
      .guest(true)
    .done()
  .done()

  /**
   * Creates a function for fetching many user documents at once. It should use the same
   * logic and security as the ordinary fetch fucntion
   */
  .fetchMany()
    .roles()
      .guest(true)
    .done()
  .done()

  /**
   * Creates a function to find by username. This can be used for searches of multiple users,
   * running login functionality, and viewing a user's page with their username in the URL
   */
  .search("findByUsername", "users_by_username")
    .indexFields(["ref"])
    .fields()
      .guest(["*"])
    .done()
    .roles()
      .guest(true)
    .done()
  .done()

  /**
   * Creates the update function. Only a user (or admin) can update themselves. This updates a small selection
   * of fields
   */
  .update()
    .roles()
      .user(isOwner_old)
      .admin(true)
    .done()
    .setFields()
      .user(updateFields)
    .done()
  .done()

  /**
   * Allows for a user to update specifically a profile image
   */
  .update("updateAvatar")
    .setFields()
      .user(["avatar.ref", "avatar.src"])
    .done()
    .roles()
      .user(isOwner_old)
      .admin(true)
    .done()
  .done()

.done().export();
