import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { Ref64 } from "types";
import { UserDocument } from "types/documents";
import { isOwner, isOwner_old } from "./security";
import * as fauna from "database/integration/fauna";
import { Collection, FaunaIndex } from "fauna";
import { UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
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
  public collection = Collection.Users;

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
  public async searchByUsername(username: string, options?: FaunaIndexOptions): Promise<UserDocument[]> {
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

  @Update
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields(["*"])
  @SetFields({[UserRole.User]: ["avatar.ref", "avatar.src"]})
  public async updateAvatar(id: Ref64, doc: Partial<UserDocument>): Promise<UserDocument> {
    const user = await fauna.updateOne<UserDocument>(id, doc);
    if (user === undefined) { 
      throw { code: 500, message: "An unexpected error occured while attepting to update the user."};
    }
    return user;
  }
}

export const UserLogic = new $UserLogic();
