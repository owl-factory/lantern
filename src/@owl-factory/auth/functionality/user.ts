import { destroyCookie } from "@owl-factory/cookies";
import { NextApiRequest } from "next/types";
import { AuthController } from "../AuthController";
import { permissionsToBinary } from "../permissions";
import { getCompressedRolePermissions } from "../globals";
import { base64toBinary } from "@owl-factory/utilities/numbers/base64";

export function fromCookie(this: AuthController<unknown>) {
  return
}

export function fromDatabase<T>(this: AuthController<T>, databaseUser: T) {
  this.reset(); // Ensures that everything is cleared out

  // Extract role & permissions (remove from user)
  const { user, role, permissions } = this.$extractSecurity(databaseUser);

  // Put user in $user
  this.$user = user;

  // Get binary role permissions
  const compressedRolePermissions = getCompressedRolePermissions(role);
  // let fullCompressedPermissions = compressedRolePermissions;

  // Compress permissions to binary
  if (permissions.length > 0) {
    const compressedPermissions = permissionsToBinary(permissions);
    // fullCompressedPermissions =  or()
  }
  // Merge

  // Binary to base64

  // Save all to cookies

}

/**
 * Loads in a user from the NextAPI Request object's cookies.
 * @param req The NextAPI Request object containing the user's cookies
 */
export function fromReq(this: AuthController<unknown>, req: NextApiRequest) {
  const rawCookie = req.cookies[this.cookieKey];
  if (!rawCookie) {
    this.reset();
    return;
  }
  const cookie = JSON.parse(rawCookie);
  this.setUser(cookie);
}

/**
 * Resets the user and the AuthController to the default state
 */
export function resetUser(this: AuthController<unknown>) {
  destroyCookie(this.cookieKey);
  this.$user = undefined;
  this.reloadPermissions();
}
/**
 * Sets a new user
 * @param user The new user that is being logged in or authenticated
 */
export function setUser<T>(this: AuthController<T>, user: T) {
  this.reset();

  this.$user = user;
  this.reloadPermissions();
  this.$saveToCookie();
}

export function fromAPI<T>(this: AuthController<T>, user: T, permissions: string, jwt: string | null) {
  this.$user = user;
  this.$permissions = base64toBinary(permissions);
  this.
}

export function logout() {

}