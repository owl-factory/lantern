import { Collection } from "src/fauna";
import { NextApiRequest } from "next";
import { encode } from "utilities/ref";
import { getSession } from "./session";
import { UserRole } from "./enums";

/**
 * A controller for managing security, primarily for the backend. It's purpose is to take in
 * a NextApiRequest object, read the current user document, and parse it into usable fields,
 * such as a loggedIn flag or the active role.
 */
export class $SecurityController<T> {
  public currentUser: Partial<T> | undefined;
  public activeRole: UserRole;

  constructor() {
    this.activeRole = UserRole.Guest;
  }

  /**
   * Boolean flag for if a user is logged in. True if a user is logged in
   */
  get loggedIn() {
    return this.currentUser !== undefined;
  }

  /**
   * Gets the user from the given NextApiRequest and stores it
   * TODO - remove Fauna dependency.
   * @param req The NextApiRequest received from an API call
   */
  public fromReq(req: NextApiRequest) {
    const session = getSession({req});

    const userRef = encode("295863299256353286", Collection.Users);
    if (!userRef) { throw "Ref failed to encode. TODO later"; }

    if (!session || session.user === undefined || session.user === null) {
      // this.currentUser = undefined;
      this.currentUser = {
        ref: userRef, // TODO - collection.users should not require import
        username: "laurasaura",

        role: UserRole.User,
      } as any;
    }
    else { this.currentUser = session.user; }

    this.update();
  }

  /**
   * Updates everything that might need to change ifw the current user changes
   */
  protected update() {
    if (!this.currentUser) {
      this.activeRole = UserRole.Guest;
      return;
    }

    this.activeRole = this.getHighestRole();
  }

  /**
   * Determines the highest role present for a given user document
   * @param myUser The MyUser Document to reference for determining the highest role present
   */
  protected getHighestRole(): UserRole {
    // Base cases. If not logged in or missing roles, Guest. If logged in but no roles set, User
  //   if (this.currentUser === undefined || !this.loggedIn) { return UserRole.GUEST; }
  //   if (!this.currentUser.roles || this.currentUser.role) { return UserRole.USER; }
  //   if (!this.currentUser.roles) { this.currentUser.role = 0; }

  //   let highest = 0;

  //   this.currentUser.roles.forEach((role: string) => {
  //     UserRoleReadable.forEach((readableRole: string, index: number) => {
  //       if (role.toLowerCase() === readableRole && index > highest) {
  //         highest = index;
  //       }
  //     });
  //   });
  //   return highest as UserRole;
  // }
    return UserRole.User;
  }
}

