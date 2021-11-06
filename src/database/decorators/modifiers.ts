import { AnyDocument } from "types/documents";

const DEFAULT_READ_FIELDS = ["id"];

// A generic type for determining what sort of access a user can have to a resource. This can be a boolean for absolute
// access or a list of strings for field access
// TODO - needs a rename
type AccessCheck<T> = ((doc: AnyDocument) => T) | T;
interface RoleAccess<T> {
  guest?: AccessCheck<T>;
  user?: AccessCheck<T>;
  moderator?: AccessCheck<T>;
  admin?: AccessCheck<T>;
}

interface ParentItem extends RoleAccess<boolean> {
  key: string;
}

interface Descriptor {
  parent?: Record<Collection, ParentItem>;
  requireLogin?: boolean;
  readFields?: string[] | ((doc: AnyDocument) => string[]);
}

const USER_LEVELS = ["guest", "user", "moderator", "admin"];

type AccessArgument = boolean | ((doc: AnyDocument) => boolean);
interface AccessType {
  guest?: AccessArgument;
  user?: AccessArgument;
  moderator?: AccessArgument;
  admin?: AccessArgument;
}

/**
 * 
 * @param roles The 
 * @returns 
 */
export function Access(roles: AccessArgument | AccessType) {
  return setFieldAccess(roles, "access");
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

// TODO - build out and put somewhere better
enum Collection {

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
export function Parent(collection: Collection, key: string, roles: AccessArgument | AccessType) {
  return (_target: any, _name: string, descriptor: Descriptor) => {
    // Ensures that the parent descriptor object is present
    if (!("parent" in descriptor)) { descriptor.parent = {}; }
    descriptor.parent[collection] = {
      key, roles,
    };
  }
  return;
}

type SingleField = string[] | ((doc: AnyDocument) => string[]);
interface RoleFields {
  guest?: SingleField;
  user?: SingleField;
  moderator?: SingleField;
  admin?: SingleField;
}

/**
 * Defines the fields that a user may access and read. The value is stored in the `readFields` property and
 * delimits access by role and optional function
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 */
export function ReadFields(fields: SingleField | RoleFields) {
  return setFieldAccess(fields, "readFields");
}

/**
 * Defines the fields that a user may access and read. The value is stored in the `setFields` property and
 * delimits access by role and optional function
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 */
 export function SetFields(fields: SingleField | RoleFields) {
  return setFieldAccess(fields, "setFields");
}

/**
 * A helper function to set field access for both read and set field functions
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 * @param fieldKey The key to save the fields in
 * @returns The decorator function to wrap around the function proper
 */
function setFieldAccess(fields: any, fieldKey: string) {
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

    let lastField: SingleField | AccessType | undefined = undefined;
    USER_LEVELS.forEach((level: (string)) => {
      const targetField = fields[level as any];
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
