import { AnyDocument } from "types/documents";
import { UserRole } from "types/security";
import { Descriptor, PerRoleAccess, RoleAccess } from "./actions";

const DEFAULT_READ_FIELDS = ["id"];

// TODO - generate naturally
const USER_LEVELS = ["guest", "user", "moderator", "admin"];


// TODO - build out and put somewhere better
enum Collection {

}


/**
 * Sets which roles may access this resource, either a boolean or a function that evaluates to a boolean
 * @param roles Each of the per-role access that is a boolean or returns a boolean
 */
export function Access(roles: RoleAccess<boolean>) {
  return setFieldRoleAccess<boolean>(roles, "access");
}

/**
 * Decorator that indicates the function is to require a login or not.
 * @param required If the user is required to be logged in. Defaults to true.
 * @returns The decorator function that sets the requirement
 */
export function RequireLogin(required = true) {
  return (_target: any, _name: string, descriptor: any) => {
    descriptor.requireLogin = required;
  };
}


/**
 * Ensures that the current user has access to the children of a collection, such as Entities for a Campaign.
 * This should generally only be used in the case of creating a document, as it requires pulling a document
 * from the database
 * @param collection The collection that the parent of the target element belongs to.
 *  (If the target is Apple, the Parent collection is Tree.)
 * @param key The input field containing the parent collection ID
 *
 * TODO - all of this
 */
export function Parent(collection: Collection, key: string, roles: any) {
  return (_target: any, _name: string, descriptor: Descriptor) => {
    // Ensures that the parent descriptor object is present
    if (!("parent" in descriptor)) { descriptor.parent = {}; }
    descriptor.parent[collection] = {
      key, roles,
    };
  };
}

/**
 * Defines the fields that a user may access and read. The value is stored in the `readFields` property and
 * delimits access by role and optional function
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 */
export function ReadFields(fields: PerRoleAccess<string[]> | RoleAccess<string[]>) {
  if (Array.isArray(fields) || typeof fields === "function") {
    return setFieldRoleAccess<string[]>({[UserRole.Guest]: fields}, "readFields");
  }
  return setFieldRoleAccess<string[]>(fields, "readFields");
}

/**
 * Defines the fields that a user may access and read. The value is stored in the `setFields` property and
 * delimits access by role and optional function
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 */
 export function SetFields(fields: PerRoleAccess<string[]> | RoleAccess<string[]>) {
  if (Array.isArray(fields) || typeof fields === "function") {
    return setFieldRoleAccess<string[]>({[UserRole.Guest]: fields}, "setFields");
  }
  return setFieldRoleAccess<string[]>(fields, "setFields");
}


/**
 * A helper function to set field access for both read and set field functions
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 * @param fieldKey The key to save the fields in
 * @returns The decorator function to wrap around the function proper
 */
function setFieldRoleAccess<T>(fields: RoleAccess<T>, fieldKey: string) {
  return (_target: any, _name: string, descriptor: any) => {
    // Ensures that we have the empty read fields if none is present so far
    if (!(fieldKey in descriptor)) {
      // TODO - can/should this initialization be moved out to a different function?
      descriptor[fieldKey] = {};
      USER_LEVELS.forEach((level: string) => {
        descriptor[fieldKey][level] = undefined;
      });
    }

    // Sets everything if given a string[] or function
    if (Array.isArray(fields) || typeof fields === "function" || typeof fields === "boolean") {
      USER_LEVELS.forEach((level: string) => {
        descriptor[fieldKey][level] = fields;
      });
      return;
    }

    let lastField: PerRoleAccess<T> | undefined = undefined;
    USER_LEVELS.forEach((level: string) => {
      const targetField = (fields as any)[level];
      const savedField = descriptor[fieldKey][level];

      if (savedField !== undefined) {
        lastField = savedField;
      }

      // Sets the new field, if one is present
      if (targetField !== undefined) {
        descriptor[fieldKey][level] = targetField;
        lastField = targetField;
        return;
      }

      // Sets the empty field with a pre-existing field
      if (savedField === undefined) {
        descriptor[fieldKey][level] = lastField;
        return;
      }
    });
  };
}
