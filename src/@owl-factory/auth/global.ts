import { AuthController } from "./AuthController";

/**
 * Allows for the owl-factory code to access the site-specific authController.
 */
let globalAuth: AuthController<unknown> | undefined;
export function setGlobalAuth(newAuth: AuthController<unknown>) {
  globalAuth = newAuth;
}

export function getGlobalAuth(): AuthController<any> {
  if (globalAuth === undefined) { throw "The global authentication has not been set."; }
  return globalAuth;
}
