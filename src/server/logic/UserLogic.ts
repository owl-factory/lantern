import { Ref64 } from "@owl-factory/types";
import { UserDocument } from "types/documents";
import { isOwner } from "./security";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Collection, FaunaIndex } from "src/fauna";
import { UserRole } from "@owl-factory/auth/enums";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { Fetch, FetchMany, Index, SignIn, SignUp, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { isEmail } from "@owl-factory/utilities/strings";

const COOKIE_FIELDS = ["ref", "username", "email", "displayName", "avatar.*"];

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

class $UserLogic extends DatabaseLogic<UserDocument> {
  public collection = Collection.Users;
  /**
   * Fetches one user from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The user document
   */
  @Fetch
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<UserDocument> {
    const user = await fauna.findByID<UserDocument>(id);
    if (user === undefined) { throw { code: 404, message: `A user with ID ${id} could not be found` }; }
    return user;
  }

  /**
   * Fetches many users from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed user documents
   */
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

  /**
   * Updates a single user
   * @param id The Ref64 ID of the document to update
   * @param doc The user partial to update
   * @returns The new, updated document
   */
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

  /**
   * Updates a single user's avatar
   * @param id The Ref64 ID of the document to update
   * @param doc The user partial to update
   * @returns The new, updated document
   */
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

  /**
   * Attempts to log in the user
   * @param username The username or email of the user attempting to log in
   * @param password The password of the user attempting to log in
   * @returns A partial user document with only the important information present
   */
  @SignIn
  @ReadFields(COOKIE_FIELDS)
  public async signIn(username: string, password: string) {
    const index = isEmail(username) ? FaunaIndex.UsersByEmail : FaunaIndex.UsersByUsername;
    const user = await fauna.signIn<UserDocument>(index, username, password);
    return user;
  }

  /**
   * Signs up a new user
   * @param user The user to create
   * @param password The password the user will be secured with
   */
  @SignUp
  @ReadFields(COOKIE_FIELDS)
  @SetFields(["username", "email"])
  public async signUp(user: Partial<UserDocument>, password: string) {
    // TODO - add default security and other fields required for the user
    const newUser = await fauna.signUp<UserDocument>(this.collection, user, password);
    return newUser;
  }
}

export const UserLogic = new $UserLogic();
