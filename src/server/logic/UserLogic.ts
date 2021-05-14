import {  query as q } from "faunadb";
import { UserDocument } from "types";
import { FaunaDocument, FaunaRef } from "types/fauna";
import { mapFauna } from "utilities";
import { getServerClient } from "utilities/db";
import { CoreModelLogic } from "./CoreModelLogic";

const guestFields = ["username"];

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
  public static async findUserByRef(ref: FaunaRef, myID: string, roles?: string[]): Promise<UserDocument | null> {
    // TODO - ref validation?
    const client = getServerClient();
    const rawUser: FaunaDocument<UserDocument> = await client.query(q.Get(ref));
    if (!rawUser) { return null; }
    const user: UserDocument = mapFauna(rawUser);

    if (this.isOwner(user, myID, roles)) { return user; }
    // TODO - fix this mess ;~;
    return CoreModelLogic.trimRestrictedFields(
      user as unknown as Record<string, unknown>, guestFields
    ) as unknown as UserDocument;
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
   * Determines if the current user has full permissions to access the user document
   * @param user The user object to sanitize
   * @param myID The current user ID
   * @param roles The roles of the current user, if any
   */
  public static isOwner(user: UserDocument, myID: string, roles: string[] = []): boolean {
    return (user.id === myID || "ADMIN" in roles);
  }
}
