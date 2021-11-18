
import {
  checkDynamicAccess,
  checkLogin,
  checkManyDynamicAccess,
  checkParentAccess,
  checkStaticAccess,
  Descriptor,
  fetchTargetDoc,
  trimManyReadFields,
  trimReadFields,
  trimSetFields,
} from "./actions";


/**
 * Handles running pre- and post-pull processing for running a create function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Create(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== 'function') {
    return;
  }

  descriptor.value = function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);
    checkParentAccess(descriptor, args);
    args.doc = trimSetFields(descriptor, args.doc);

    let result = original.apply(this, args);

    result = checkDynamicAccess(descriptor, result);
    result = trimReadFields(descriptor, result);

    return result;
  };
}

/**
 * Handles running pre- and post-pull processing for running a delete function. Uses @RequireLogin, @Access, @
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Delete(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== "function") { return; }

  descriptor.value = async function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);
    const targetDoc = await fetchTargetDoc(descriptor, args);
    if (targetDoc === undefined) { return undefined; }
    checkDynamicAccess(descriptor, targetDoc);

    return original.apply(this, args);
  };
}


/**
 * Handles running pre- and post-pull processing for running a fetch function.
 * Fetch uses the @Access, @RequireLogin, and @ReadFields decorators
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Fetch(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== 'function') {
    return;
  }

  descriptor.value = async function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);

    let result = await original.apply(this, args);

    checkDynamicAccess(descriptor, result);
    result = trimReadFields(descriptor, result);
    return result;
  };
}

/**
 * Handles running pre- and post-pull processing for running a fetch many function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function FetchMany(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== 'function') {
    return;
  }

  descriptor.value = async function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);

    let result = await original.apply(this, args);

    result = checkManyDynamicAccess(descriptor, result);
    result = trimManyReadFields(descriptor, result);
    return result;
  };
}

/**
 * Handles running pre- and post-pull processing for running an index search function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
export function Index(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== 'function') {
    return;
  }

  descriptor.value = async function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);
    let result = await original.apply(this, args);

    result = checkManyDynamicAccess(descriptor, result);
    result = trimManyReadFields(descriptor, result);
    return result;
  };
}

/**
 * Handles running pre- and post-pull processing for running an update function
 * @param _target The target class
 * @param _name The name of the function
 * @param descriptor The properties of the function
 */
 export function Update(_target: any, _name: string, descriptor: any) {
  const original = descriptor.value;
  if (typeof original !== 'function') {
    return;
  }

  descriptor.value = async function(...args: any) {
    checkLogin(descriptor);
    checkStaticAccess(descriptor);
    const targetDoc = await fetchTargetDoc(descriptor, args[0]);
    if (targetDoc === undefined) { throw { code: 404, message: "Document could not be found"}}
    checkDynamicAccess(descriptor, targetDoc);
    args[1] = trimSetFields(descriptor, args[1]);

    let result = await original.apply(this, args);

    result = trimReadFields(descriptor, result);
    return result;
  };
}
