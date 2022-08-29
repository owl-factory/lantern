import type { Ref64 } from "@owl-factory/types";
import { UserDocument } from "types/documents";
import * as fauna from "@owl-factory/database/utilities/integration/fauna";
import { Collection, FaunaIndex } from "src/fauna";
import { Fetch, Search, SignIn, SignUp, Update } from "@owl-factory/database/utilities/decorators/decorators";
import type { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { isEmail } from "@owl-factory/utilities/strings";
import * as access from "./access";

const COOKIE_FIELDS = ["ref", "username", "email", "name", "avatar.*", "role", "permissions", "boost"];

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

const collection = Collection.Users;

class $UserLogic {
  /**
   * Attempts to identify the given document with the password
   * @param ref The ref of the user document to identify
   * @param password The password to use to identify the document
   * @returns True if the password matches the user document, false otherwise
   */
  public async identify(ref: Ref64, password: string) {
    return await fauna.identify(ref, password);
  }

  /**
   * Fetches one user from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The user document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<UserDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Searches for users with a specific username
   * @param username The username to search by
   * @param options Any additional options to configure the search
   * @returns A list of all users matching that username
   */
  @Search(["*"])
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
  @Update(collection, ["*"] , ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<UserDocument>): Promise<UserDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Updates a single user's avatar
   * @param id The Ref64 ID of the document to update
   * @param doc The user partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["avatar.ref", "avatar.src"], (ref) => access.fetch(collection, ref))
  public async updateAvatar(ref: Ref64, doc: Partial<UserDocument>): Promise<UserDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Updates the user's password
   * @param ref The ref of the user document to update
   * @param oldPassword The old password
   * @param password The new password
   */
  public async updatePassword(ref: Ref64, password: string): Promise<UserDocument> {
    return await access.update<UserDocument>(
      collection, ref, {}, { credentials: password });
  }

  /**
   * Updates a user's consumed storage amount
   * @param ref The Ref64 ID of the document to update
   * @param doc The user partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["storageUsed"], (ref) => access.fetch(collection, ref))
  public async updateStorageUsed(ref: Ref64, doc: Partial<UserDocument>): Promise<UserDocument> {
    const user = await fauna.updateOne<UserDocument>(ref, doc);
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
  @SignIn(COOKIE_FIELDS)
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
  @SignUp(COOKIE_FIELDS, ["username", "email"])
  public async signUp(user: Partial<UserDocument>, password: string) {
    // TODO - add default security and other fields required for the user
    const newUser = await fauna.signUp<UserDocument>(collection, user, password);
    return newUser;
  }
}

export const UserLogic = new $UserLogic();
