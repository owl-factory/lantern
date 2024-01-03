import { StorageControllerState } from "features/dynamicRender/types/controllers/storage";
import { GetOptions } from "features/dynamicRender/types/query";

/**
 * Defines the base Storage Controller functionality for use with dependency injection
 * TODO - split this up into Characters, Rulesets, Campaigns with StorageControllers as a dependency
 */
export abstract class StorageController {
  _state: StorageControllerState = StorageControllerState.NoOp;
  _error: string | undefined;

  constructor() {}

  /** The ready state of the controller */
  get ready() {
    return this._state === StorageControllerState.Ready;
  }

  /**
   * Updates the state within a specific action so that MobX can watch, as well as marking an optional error
   * @param state - The new state
   * @param error - Any error encountered
   */
  setState(state: StorageControllerState, error?: string) {
    this._state = state;
    this._error = error;
  }

  async load() {}

  abstract get<T>(options: GetOptions | string): T | undefined;
  abstract update<T>(options: GetOptions, value: T): boolean;
}
