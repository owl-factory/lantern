import { MarkupControllerState, Prefabs } from "features/dynamicRender/types/controllers/markup";
import { Controller } from "features/dynamicRender/types/controller";
import { ParsedNode } from "features/dynamicRender/types/render";
import { MarkupComponents } from "features/dynamicRender/utils/markup/parseSheet";

/**
 * Defines the common functionality for the Markup Controllers
 */
export class MarkupController implements Controller {
  _state: MarkupControllerState = MarkupControllerState.NoOp;
  _error: string | undefined;

  _layout: ParsedNode[];
  _prefabs: Prefabs;

  constructor() {}

  /** Marks this controller as ready and usable */
  get ready() {
    return this._state === MarkupControllerState.Ready;
  }

  /** The core structure of the Dynamic Render */
  get layout(): ParsedNode[] {
    if (!this.ready) return undefined;
    return this._layout;
  }

  /**
   * Gets a prefabricated chunk of elements
   * @param key - The key of the prefab to load
   * @returns A prefab element, if one exists for the key.
   *  If missing or the controller is not ready, undefined is returned instead
   */
  prefab(key: string) {
    if (!this.ready) return undefined;
    const normalizedKey = key.trim().toLocaleLowerCase();
    return this._prefabs[normalizedKey];
  }

  /**
   * Performs any async tasks, and marks the controller as waiting on data.
   */
  async load() {
    const initialized = this._state === MarkupControllerState.Initialized;
    if (!initialized) return;
    this.setState(MarkupControllerState.WaitingOnData);
  }

  /**
   * Sets the data used for building the structure of the Dynamic Render.
   * This can only be used when the controller is waiting on data, or is ready;
   * anything else will be a no-op
   * @param data - The object containing the layout and prefabs
   */
  setData(data: MarkupComponents) {
    const waitingOnData = this._state === MarkupControllerState.WaitingOnData;
    if (!waitingOnData && !this.ready) return;

    this._layout = data.layout;
    this._prefabs = data.prefabs;
    this.setState(MarkupControllerState.Ready);
  }

  /**
   * Updates the state within a specific action so that MobX can watch, as well as marking an optional error
   * @param state - The new state
   * @param error - Any error encountered
   */
  setState(state: MarkupControllerState, error?: string) {
    this._state = state;
    this._error = error;
  }
}
