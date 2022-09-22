import { AuthController } from "../AuthController";
import { getGlobalPermissionKeys } from "../../utilities/globals";

/**
 * Checks if the current user has a given permission
 * @param permission The permission key to check if present
 */
export function hasPermission(this: AuthController<unknown>, permission: string): boolean {
  return false;
  // if (this.$permissions === undefined) { return false; }

  // const permissions = getGlobalPermissionKeys();
  // if (permissions.length !== (this.$permissions.length - 1)) {
  //   console.error(`There is a mismatch of the permission lengths in AuthController for permission "${permission}".
  //     The evaluation will fail.`
  //   );
  //   return false;
  // }
  // const index = permissions.indexOf(permission);
  // if (index === -1) { return false; }

  // const bit = this.$permissions.charAt(index + 1); // +1 to account for leading bit
  // return bit === "1";
}
