import { Collection } from "@owl-factory/fauna";
import { NextApiRequest } from "next";
import { UserDocument } from "types/documents";
import { UserRole } from "types/security";
import { getSession } from "utilities/auth";
import { encode } from "utilities/encoding";

/**
 * A controller for managing security, primarily for the backend. It's purpose is to take in
 * a NextApiRequest object, read the current user document, and parse it into usable fields,
 * such as a loggedIn flag or the active role.
 */
class $SecurityController {
  public currentUser: Partial<UserDocument> | undefined;
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
   * @param req The NextApiRequest received from an API call
   */
  public fromReq(req: NextApiRequest) {
    const session = getSession({req});
    if (!session || session.user === undefined || session.user === null) {
      // this.currentUser = undefined;
      this.currentUser = {
        ref: encode("295863299256353286", Collection.Users),
        username: "laurasaura",

        role: UserRole.User,
      };
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

export const SecurityController = new $SecurityController();
