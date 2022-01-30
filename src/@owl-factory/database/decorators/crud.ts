
import {
  checkDynamicAccess,
  checkLogin,
  checkManyDynamicAccess,
  checkParentAccess,
  checkPermissionAccess,
  checkStaticAccess,
  fetchTargetDoc,
  setCreateFields,
  setUpdateFields,
  trimManyReadFields,
  trimReadFields,
  trimSetFields,
} from "./actions";

const FIELD_KEY = "permission";

/**
 * Handles running pre- and post-pull processing for running a create function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Create(permission: string) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') {
      return;
    }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);
      checkParentAccess(descriptor, args);

      args[0] = trimSetFields(descriptor, args[0]);
      args[0] = setCreateFields(descriptor, args[0]);

      let result = await original.apply(this, args);
      result = checkDynamicAccess(descriptor, result);
      result = trimReadFields(descriptor, result);

      return result;
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running a delete function. Uses @RequireLogin, @Access, @
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Delete(permission: string) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== "function") { return; }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);

      const targetDoc = await fetchTargetDoc(descriptor, args[0]);
      if (targetDoc === undefined) { return undefined; }
      checkDynamicAccess(descriptor, targetDoc);

      return original.apply(this, args);
    };
  };
}


/**
 * Handles running pre- and post-pull processing for running a fetch function.
 * Fetch uses the @Access, @RequireLogin, and @ReadFields decorators
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Fetch(permission: string) {
  
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      if (args[0] === "") { return { $error: true }; } // TODO - change to empty/error value
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);

      let result = await original.apply(this, args);

      checkDynamicAccess(descriptor, result);
      result = trimReadFields(descriptor, result);
      return result;
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running a fetch many function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function FetchMany(permission: string) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);

      let result = await original.apply(this, args);

      result = checkManyDynamicAccess(descriptor, result);
      result = trimManyReadFields(descriptor, result);
      return result;
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running an index search function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Index(permission: string) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);

      let result = await original.apply(this, args);

      result = checkManyDynamicAccess(descriptor, result);
      result = trimManyReadFields(descriptor, result);
      return result;
    };
  };
}

/**
 * Handles running pre- and post-pull processing for running an update function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Update(permission: string) {
  return (_target: any, _name: string, descriptor: any) => {
    const original = descriptor.value;
    if (typeof original !== 'function') { return; }

    descriptor[FIELD_KEY] = permission;

    descriptor.value = async function(...args: any) {
      checkLogin(descriptor);
      checkPermissionAccess(descriptor);
      checkStaticAccess(descriptor);

      const targetDoc = await fetchTargetDoc(descriptor, args[0]);
      if (targetDoc === undefined) { throw { code: 404, message: "Document could not be found"}; }
      checkDynamicAccess(descriptor, targetDoc);
      args[1] = trimSetFields(descriptor, args[1]);
      args[1] = setUpdateFields(descriptor, args[1]);


      let result = await original.apply(this, args);

      result = trimReadFields(descriptor, result);
      return result;
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
