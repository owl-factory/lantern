import { MarkupControllerState, Prefabs } from "features/dynamicRender/types/controllers/markup";
import { MarkupComponents } from "../parse";
import { Controller } from "features/dynamicRender/types/controller";

/**
 * Defines the common functionality for the Markup Controllers
 */
export class MarkupController implements Controller {
  _layout: Element;
  _prefabs: Prefabs;

  state: MarkupControllerState = MarkupControllerState.NoOp;

  constructor() {}

  get ready() {
    return this.state === MarkupControllerState.Ready;
  }

  /** The core structure of the Dynamic Render */
  get layout(): Element {
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
    const initialized = this.state === MarkupControllerState.Initialized;
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
    const waitingOnData = this.state === MarkupControllerState.WaitingOnData;
    if (!waitingOnData && !this.ready) return;

    this._layout = data.layout;
    this._prefabs = data.prefabs;
    this.setState(MarkupControllerState.Ready);
  }

  /**
   * Sets the state. Requried by MobX to track the set as an action
   * @param state - The new state to set
   */
  setState(state: MarkupControllerState) {
    this.state = state;
  }

  isValid() {
    return true;
  }
  getErrors: () => string[];
}
