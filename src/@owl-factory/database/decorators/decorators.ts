import {
  trimReadFields,
  trimSetFields,
} from "./actions";
import { createWrapper, deleteWrapper, fetchWrapper, searchWrapper, updateWrapper } from "./wrappers";


/**
 * Handles running pre- and post-pull processing for running a create function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Create(readFields: DocumentField, setFields: DocumentField, validation?: DocumentValidation) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') {
      return;
    }

    descriptor.readFields = readFields;
    descriptor.setFields = setFields;
    descriptor.validateDocument = validation;

    descriptor.value = async function(...args: any) {
      return await createWrapper(descriptor, async (doc: any) => original.apply(this, doc), args[0]);
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running a delete function. Uses @RequireLogin, @Access, @
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Delete(collection: string, fetchFunction: DocumentFetch) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== "function") { return; }

    descriptor.collection = collection;
    descriptor.fetch = fetchFunction;

    descriptor.value = async function(...args: any) {
      return await deleteWrapper(descriptor, (ref: string) => original.apply(this, ref), args[0]);
    };
  };
}

type DocumentFetch = (ref: string) => Promise<any>;
type DocumentField = string[] | ((doc: any) => string[]);
type DocumentValidation = (doc: any) => void;

/**
 * Handles running pre- and post-pull processing for running a fetch function.
 * Fetch uses the @Access, @RequireLogin, and @ReadFields decorators
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Fetch(collection: string, readFields: DocumentField) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor.collection = collection;
    descriptor.readFields = readFields;

    descriptor.value = async function(...args: any) {
      return await fetchWrapper(descriptor, (ref: string) => original.apply(this, ref), args[0]);
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running an index search function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Search(readFields: DocumentField) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor.readFields = readFields;

    descriptor.value = async function(...args: any) {
      return await searchWrapper(descriptor, (arg: any) => original.apply(this, arg), args);
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running an update function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Update(
  collection: string,
  readFields: DocumentField,
  setFields: DocumentField,
  fetchFunction: DocumentFetch,
  validation?: DocumentValidation
) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor.collection = collection;
    descriptor.readFields = readFields;
    descriptor.setFields = setFields;
    descriptor.fetch = fetchFunction;
    descriptor.validateDocument = validation;

    descriptor.value = async function(...args: any) {
      return await updateWrapper(descriptor, original, args[0], args[1]);
    };
  };
}

/**
 * Handles the pre- and post-signin code
 * @param _target The target class
 * @param _name The target name
 * @param descriptor The properties of the function
 */
export function SignIn() {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor.value = async function(...args: any) {
      let result = await original.apply(this, args);
      result = trimReadFields(descriptor, result);
      return result;
    };
  };
}

/**
 * Handles the pre- and post-signup code
 * @param _target The target class
 * @param _name The target name
 * @param descriptor The properties of the function
 */
 export function SignUp() {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor.value = async function(...args: any) {
      args[0] = trimSetFields(descriptor, args[0]);

      let result = await original.apply(this, args);
      result = trimReadFields(descriptor, result);
      return result;
    };
  };
}
