import {  Expr, query as q } from "faunadb";
import { UserDocument } from "types/documents";
import { FaunaDocument, FaunaRef } from "types/fauna";
import { mapFauna } from "utilities/fauna";
import { getServerClient } from "utilities/db";
import { CoreModelLogic } from "server/logic";

const guestFields = [
  "username",
  "displayName",
  "icon",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
  "badges",
];
const updateFields = [
  "displayName",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
];

// TODO - change findByIDs/Refs to find by ID. Nothing matters except that they are either
// strings or structs containing { id } or { ref }. Validate refs. Build them from IDs
// if possible. Another @TODO - manually build ref objects (or repair them).

export class UserLogic {
  /**
   * Finds a user by their ID and returns sanitized values
   * @param id The id of the user to find
   * @param myID The ID of the current user
   * @param roles The roles of the current user, if any
   */
  public static async findUserByRef(
    ref: FaunaRef | Expr,
    myID: string,
    roles?: string[]
  ): Promise<UserDocument | null> {
    // TODO - ref validation?
    const client = getServerClient();
    const rawUser: FaunaDocument<UserDocument> = await client.query(q.Get(ref));
    if (!rawUser) { return null; }
    const user: UserDocument = mapFauna(rawUser) as UserDocument;

    if (this.isOwner(user, myID, roles)) { return user; }
    // TODO - fix this mess ;~;
    return CoreModelLogic.trimRestrictedFields(
      user as unknown as Record<string, unknown>, guestFields
    ) as unknown as UserDocument;
  }

  /**
   * Fetches a user by their username
   * @param username The username to search for
   * @param myID The current user's id
   * @param roles The current user's roles
   */
  public static async findUserByUsername(
    username: string,
    myID: string,
    roles?: string[]
  ): Promise<UserDocument | null> {
    const rawIndex = await CoreModelLogic.fetchByIndex(
      `users_by_username`,
      [username],
      ["ref"],
      { size: 1 }
    );
    if (rawIndex.length === 0) { return null; }


    return await this.findUserByRef(rawIndex[0].ref, myID, roles);
  }

  /**
   * Finds a collection of users by their refs
   * @param refs The refs, given as an array of objects containing ref
   * @param myID The current user's ID
   * @param roles The current user's roles
   * @TODO - combine the user id and roles into a single object? Good idea- do later
   */
  public static async findUsersByRefs(refs: UserDocument[], myID: string, roles?: string[]): Promise<UserDocument[]> {
    const users: Promise<UserDocument>[] = [];
    refs.forEach((ref: UserDocument) => {
      if (!ref.ref) { return; }
      const user = this.findUserByRef(ref.ref, myID, roles);
      if (user === null) { return; }

      users.push(user as Promise<UserDocument>);
    });

    return Promise.all(users);
  }

  /**
   * Creates and returns a new user document in Fauna
   * @param user The user to create into a document
   * TODO - actually make this xD
   */
  public static async createUser(user: UserDocument): Promise<UserDocument> {
    return {};
  }

  /**
   * Updates a single user's document in Fauna
   * @param user The partial user document to update
   * @param myID The id of the current user, to determine access rights
   * @param roles The roles of the current user, to determine access rights
   */
  public static async updateUser(user: UserDocument, myID: string, roles?: string[]): Promise<UserDocument> {
    const fetchedUser = await this.findUserByRef(user.ref as FaunaRef, myID, roles);
    if (!fetchedUser) { throw { code: 404, status: "User does not exist!" }; }
    if (!this.isOwner(fetchedUser, myID, roles)) {
      throw { code: 403, status: "You do not have permissions to edit this user!" };
    }
    const processedUser = CoreModelLogic.trimRestrictedFields(user, updateFields);
    const updatedUser = mapFauna(
      await CoreModelLogic.updateOne(user.ref as FaunaRef, processedUser, myID)
    ) as UserDocument;
    return updatedUser;
  }

  /**
   * Determines if the current user has full permissions to access the user document
   * @param user The user object to sanitize
   * @param myID The current user ID
   * @param roles The roles of the current user, if any
   */
  public static isOwner(user: UserDocument, myID: string, roles: string[] = []): boolean {
    return (user.id === myID || "ADMIN" in roles);
  }
}
