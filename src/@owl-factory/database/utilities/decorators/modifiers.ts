import { LogicDescriptor } from "./types";

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
 * Determines if a user is able to access a specific document
 * @param fx The function to determine dynamic access to a document
 * @returns Any errors encountered
 */
export function Dynamic(fx: (doc: any) => string) {
  return (_target: any, _name: string, descriptor: LogicDescriptor) => {
    descriptor.dynamicAccess = fx;
  };
}

/**
 * Determines if a user is able to access any documents via this method
 * @param fx The function to determine static access to a document
 * @returns Any errors encountered
 */
export function Static(fx: () => string) {
  return (_target: any, _name: string, descriptor: LogicDescriptor) => {
    descriptor.staticAccess = fx;
  };
}
