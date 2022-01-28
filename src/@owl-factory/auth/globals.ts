/**
 * Global values used for Owl Factory authentication to pass site-specific values around
 * without needing to do any odd workarounds.
 */
import { AuthController } from "./AuthController";
import { Permission, Role } from "./types";

let globalAuth: AuthController<unknown> | undefined;

/**
 * Sets an Authentication Controller to the global value for access by @owl-factory functions
 * @param newAuth The new Authentication Controller to set as a global value
 */
export function setGlobalAuth(newAuth: AuthController<unknown>) {
  globalAuth = newAuth;
}

/**
 * Fetches the global authentication controller, allowing the site-defined controller to be
 * accessed by @owl-factory code
 */
export function getGlobalAuth(): AuthController<any> {
  if (globalAuth === undefined) { throw "The global authentication has not been set."; }
  return globalAuth;
}


let globalRoles: Record<string, Role> | undefined;
/**
 * Sets site-specific roles to the global value for access by @owl-factory functions
 * @param newRoles The new roles to set as a global value
 */
export function setGlobalRoles(newRoles: Record<string, Role>) {
  globalRoles = newRoles;
}

/**
 * Fetches the global roles, allowing the site-defined roles to be accessed by @owl-factory code
 */
export function getGlobalRoles(): Record<string, Role> {
  if (globalRoles === undefined) { throw "The global roles have not been set."; }
  return globalRoles;
}

let globalPermissions: Permission[] | undefined;
/**
 * Sets site-specific permissions to the global value for access by @owl-factory functions
 * @param newPermissions The new permissions to set as a global value
 */
export function setGlobalPermissions(newPermissions: Permission[]) {
  globalPermissions = newPermissions;
}

/**
 * Fetches the global permissions, allowing the site-defined permissions to be accessed by @owl-factory code
 */
export function getGlobalPermissions(): Permission[] {
  if (globalPermissions === undefined) { throw "The global permissions have not been set."; }
  return globalPermissions;
}
