import { NextContext } from "../types";

// The current next context, if any. Populated if this is the backend.
let ctx: NextContext | undefined = undefined;

/**
 * Sets the global context variable
 * @param newCtx The next context to set into the global context variable
 */
export function initializeNextContext(newCtx: NextContext) {
  ctx = newCtx;
}

/**
 * Gets the current context
 */
export function getCtx() { return ctx; }
