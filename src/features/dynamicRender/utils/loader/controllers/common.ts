import { Controller } from "features/dynamicRender/types/controller";
import { LoaderControllerState } from "features/dynamicRender/types/controllers/loader";

/**
 * Defines the common functionality for the Markup Loader Controllers,
 * which are responsible for loading in Markup from different sources
 */
export abstract class LoaderController implements Controller {
  _state: LoaderControllerState = LoaderControllerState.NoOp;
  _error: string | undefined;

  markup: string = "";

  constructor() {}

  abstract fetch(): Promise<void>;

  /**
   * Loads all asynchronous or synchonous data and concludes any setup
   */
  async load(): Promise<void> {
    const initialized = this._state === LoaderControllerState.Initialized;
    if (!initialized) return;

    this.setState(LoaderControllerState.Loading);
    await this.fetch();
  }

  /**
   * Indicates that fetching is possible for the current state of the controller
   */
  canFetch(): boolean {
    switch (this._state) {
      case LoaderControllerState.Loading:
      case LoaderControllerState.Fetching:
      case LoaderControllerState.Ready:
        return true;
      default:
        return false;
    }
  }

  /** The ready state of the controller */
  get ready() {
    if (this._state === LoaderControllerState.Ready || this._state === LoaderControllerState.Fetching) {
      return true;
    }
    return false;
  }

  /**
   * Updates the state within a specific action so that MobX can watch, as well as marking an optional error
   * @param state - The new state
   * @param error - Any error encountered
   */
  setState(state: LoaderControllerState, error?: string) {
    this._state = state;
    this._error = error;
  }
}
