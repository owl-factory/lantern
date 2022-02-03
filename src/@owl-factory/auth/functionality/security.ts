import { AuthController } from "../AuthController";
import { getGlobalRoles } from "../globals";

/**
 * Combines all of the user's role and custom permissions into one struct for easy
 * reference
 */
export function buildPermissions(this: AuthController<unknown>) {
  this.$fullPermissions = {};
  const allRoles = getGlobalRoles();

  let rolePermissions: string[] = [];
  if (this.$role && this.$role in allRoles) {
    const role = allRoles[this.$role];
    rolePermissions = role.permissions;
  }

  const summedPermissions = rolePermissions.concat(this.$permissions);
  summedPermissions.forEach((permission: string) => {
    this.$fullPermissions[permission] = true;
  });
}

export function compressPermissions(this: AuthController<unknown>) {
  const userPermissions = this.$permissions.sort();
}

/**
 * Checks if the current user has a given permission
 * @param permission The permission key to check if present
 */
export function hasPermission(this: AuthController<unknown>, permission: string) {
  return (permission in this.$fullPermissions);
}

/**
 * Reruns all of the permission determination code
 */
export function reloadPermissions(this: AuthController<unknown>) {
  this.$setRole();
  this.$setPermissions();
  this.buildPermissions();
}
