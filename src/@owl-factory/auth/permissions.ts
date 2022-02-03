import { getUniques } from "@owl-factory/utilities/arrays";
import { getGlobalPermissionKeys, getGlobalPermissions, getGlobalRole } from "./globals";

/**
 * Converts an array of permissions to binary.
 * @param targetPermissions The target permissions to convert into a binary string
 * @param globalPermissions The global permissions (or overloaded permissions) to check against.
 *  These are assumed to be alphabetically sorted beforehand
 */
export function permissionsToBinary(targetPermissions: string[], globalPermissions?: string[]) {
  let compressed = "1"; // Lead with a bit to prevent trimming of the lead zeroes
  if (globalPermissions === undefined) {
    globalPermissions = getUniques(getGlobalPermissions(), "key");
  }

  // Base case in the even that the target permissions is empty.
  if (targetPermissions.length === 0) {
    compressed = compressed.padEnd(globalPermissions.length + 1, "0");
    return compressed;
  }

  // Ideally these are sorted beforehand to save processing time
  targetPermissions.sort();

  let targetIndex = 0;
  let targetPermission = targetPermissions[0];

  // This loop assumes that the target permissions are a subset of global permissions
  // If this is not the case, this will fail and throw an error
  // Should we then also do a longer, more complex loop that will take more time?
  for (const permission of globalPermissions) {
    if (permission !== targetPermission) {
      compressed += "0";
      continue;
    }
    compressed += "1";
    targetIndex++;
    targetPermission = targetPermissions[targetIndex];
  }

  return compressed;
}

/**
 * Converts a string of binary characters into a usable array of permissions
 * @param binary The binary string to convert back into an array of permissions
 * @param globalPermissions The global permissions (or overloaded permissions) to check against.
 *  These are assumed to be alphabetically sorted beforehand
 */
export function permissionsFromBinary(binary: string, globalPermissions?: string[]) {
  if (globalPermissions === undefined) { globalPermissions = getGlobalPermissionKeys(); }

  // Handles case where the lengths do not match. Defaults to no permissions to avoid any mistakes
  if (binary.length - 1 !== globalPermissions.length) {
    console.error(
      `A mismatch has occured bteween the permission binary and global permissions lengths. No permissions are granted.`
    );
    return [];
  }

  const permissions: string[] = [];
  binary = binary.substring(1);
  for (let i = 0; i < binary.length; i++) {
    if (binary.charAt(i) === "1") { permissions.push(globalPermissions[i]); }
  }

  return permissions;
}

/**
 * Grabs the role permissions and combines them with the user's permissions
 * @param role A user's role
 * @param permissions A user's permissions
 * @returns An array of all of a user's permissions sorted alphabetically
 */
export function buildFullPermissions(role: string, permissions: string[]) {
  const rolePermissions = getGlobalRole(role).permissions;
  const removePermissions: string[] = [];

  const fullPermissionStruct: Record<string, boolean> = {};

  for(const permission of rolePermissions) { fullPermissionStruct[permission] = true; }
  for (const permission of permissions) {
    if (permission.charAt(0) === "-") { removePermissions.push(permission); }
    else { fullPermissionStruct[permission] = true; }
  }

  for(const permission of removePermissions) { delete fullPermissionStruct[permission]; }

  const fullPermissions = Object.keys(fullPermissionStruct).sort();
  return fullPermissions;
}
