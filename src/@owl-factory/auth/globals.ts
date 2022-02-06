/**
 * Global values used for Owl Factory authentication to pass site-specific values around
 * without needing to do any odd workarounds.
 */
import { getUniques } from "@owl-factory/utilities/arrays";
import { AuthController } from "./AuthController";
import { permissionsToBinary } from "./permissions";
import { Permission, Role } from "./types";

let globalAuth: AuthController<unknown> | undefined;
let globalRoles: Record<string, Role> | undefined;
let globalPermissions: Permission[] | undefined;
let globalPermissionKeys: string[] | undefined;
const compressedRolePermissions: Record<string, string> = {};

/**
 * Fetches the global authentication controller, allowing the site-defined controller to be
 * accessed by @owl-factory code
 */
 export function getGlobalAuth(): AuthController<any> {
  if (globalAuth === undefined) { throw "The global authentication has not been set."; }
  return globalAuth;
}

/**
 * Fetches the global roles, allowing the site-defined roles to be accessed by @owl-factory code
 */
 export function getGlobalRoles(): Record<string, Role> {
  if (globalRoles === undefined) { throw "The global roles have not been set."; }
  return globalRoles;
}

/**
 * Grabs a single role from the global roles
 * @param role The key of the role to grab, if any
 */
export function getGlobalRole(role: string): Role {
  if (globalRoles === undefined) { throw "The global roles have not been set."; }
  if (!(role in globalRoles)) { throw `The role ${role} does not exist in globalRoles`; }
  return globalRoles[role];
}

/**
 * Fetches the global permissions, allowing the site-defined permissions to be accessed by @owl-factory code
 */
 export function getGlobalPermissions(): Permission[] {
  if (globalPermissions === undefined) { throw "The global permissions have not been set."; }
  return globalPermissions;
}

/**
 * Fetches the global permissions, allowing the site-defined permissions to be accessed by @owl-factory code
 */
 export function getGlobalPermissionKeys(): string[] {
  if (globalPermissionKeys === undefined) { throw "The global permissions have not been set."; }
  return globalPermissionKeys;
}

/**
 * Grabs the compressed binary string of role permissions
 * @param key The role to grab permissions for
 */
 export function getCompressedRolePermissions(key: string): string {
  if (!(key in compressedRolePermissions)) { throw `No role for ${key} could be found`; }
  return compressedRolePermissions[key];
}

// SETTERS

/**
 * Sets an Authentication Controller to the global value for access by @owl-factory functions
 * @param newAuth The new Authentication Controller to set as a global value
 */
export function setGlobalAuth(newAuth: AuthController<unknown>) {
  globalAuth = newAuth;
}

/**
 * Sets site-specific roles to the global value for access by @owl-factory functions
 * @param newRoles The new roles to set as a global value
 */
export function setGlobalRoles(newRoles: Record<string, Role>) {
  globalRoles = newRoles;
  setCompressedRolePermissions();
}

/**
 * Sets site-specific permissions to the global value for access by @owl-factory functions
 * @param newPermissions The new permissions to set as a global value
 */
export function setGlobalPermissions(newPermissions: Permission[]) {
  globalPermissions = newPermissions;
  globalPermissionKeys = getUniques(newPermissions, "key").sort();
  setCompressedRolePermissions();
}

/**
 * Sets the compressed binary permissions for each role to save on calculations later on.
 * This function should be run at buildtime.
 */
function setCompressedRolePermissions() {
  const roles = globalRoles;
  const permissions = globalPermissions;

  if (roles === undefined || permissions === undefined) { return; }

  const roleKeys = Object.keys(roles);
  for (const key of roleKeys) {
    const role = roles[key];
    const compressedPermissions = permissionsToBinary(role.permissions);
    compressedRolePermissions[key] = compressedPermissions;
  }
}


