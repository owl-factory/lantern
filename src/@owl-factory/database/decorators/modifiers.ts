import { AnyDocument } from "types/documents";
import { AccessFieldValue, AccessFunction, Descriptor } from "./actions";

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
export function Access(roles: AccessFieldValue<boolean>) {
  if (typeof roles === "function") { return setFieldAccess<AccessFunction<boolean>>(roles, "access"); }
  return setFieldAccess<boolean>(roles as boolean, "access");
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
export function ReadFields(fields: AccessFieldValue<string[]>) {
  return setFieldAccess<string[]>(fields, "readFields");
}

/**
 * Defines the fields that a user may access and read. The value is stored in the `setFields` property and
 * delimits access by role and optional function
 * @param fields A list of fields, a function that evaluates to a list of fields, or a role-delimited dictionary
 *  that is or evaluates to a list of fields.
 */
 export function SetFields(fields: AccessFieldValue<string[]>) {
  return setFieldAccess<string[]>(fields, "setFields");
}

/**
 * A helper function to set field access without roles
 * @param value The value to set
 * @param fieldKey The key to set in the descriptor
 */
function setFieldAccess<T>(value: AccessFieldValue<T>, fieldKey: string) {
  return (_target: any, _name: string, descriptor: any) => {
    descriptor[fieldKey] = value;
  };
}
