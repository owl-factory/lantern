import { AnyDocument } from "types/documents";
import { requireLogin } from "./actions";

const DEFAULT_READ_FIELDS = ["id"];

interface Descriptor {
  requireLogin?: boolean;
  readFields?: string[] | ((doc: AnyDocument) => string[]);
}

const USER_LEVELS = ["guest", "user", "moderator", "admin"];

/**
 * Decorator that indicates the function is to require a login
 * @param required If the user is required to be logged in. Defaults to true.
 * @returns The decorator function that sets the requirement
 */
export function RequireLogin(required = true) {
  return (_target: any, _name: string, descriptor: any) => {
    descriptor.requireLogin = required;
  };
}

type AccessArgument = boolean | ((doc: AnyDocument) => boolean);
interface AccessType {
  guest?: AccessArgument;
  user?: AccessArgument;
  moderator?: AccessArgument;
  admin?: AccessArgument;
}

export function Access(roles: AccessArgument | AccessType) {
  return setFieldAccess(roles, "access");
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

/**
 * Handles running pre- and post-pull processing for running a fetch function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Fetch(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = function(...args: any) {
      try {
        requireLogin(descriptor);
        // Static access check
        const result = original.apply(this, args);
        // Dynamic access check
        // ReadFields
        return result;
      } catch (e) {
        console.log(`Error: ${e}`);
        throw e;
      }
    };
  }
}

/**
 * Handles running pre- and post-pull processing for running an index search function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Index(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = function(...args: any) {
      try {
        requireLogin(descriptor);
        // Static access check
        checkStaticAccess(descriptor);
        let result = original.apply(this, args);
        // Dynamic access check
        result = checkDynamicAccess(descriptor, result);
        // ReadFields
        result = trimReadFields(descriptor, result);
        return result;
      } catch (e) {
        console.log(`Error: ${e}`);
        throw e;
      }
    }
  }
}
