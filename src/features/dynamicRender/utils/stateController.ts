import { action, observable, safeMakeObservable } from "lib/mobx";

/** Defines the different states of the StateController */
enum StateControllerState {
  /** No actions have been done on this StateController */
  NoOp,

  /** The state controller is ready to receive and serve data */
  Ready,

  /** An error occured with MobX */
  MobxError,
}

/** A controller for managing the state of the Dynamic Render */
export class StateController {
  _state: StateControllerState = StateControllerState.NoOp;
  _collapses: Record<string, boolean> = {};
  _activePages: Record<string, string> = {};
  _pageGroups: Record<string, string[]> = {};

  constructor() {
    const mobxResult = safeMakeObservable(this, {
      _state: observable,
      setState: action,

      _collapses: observable,
      createCollapse: action,
      deleteCollapse: action,
      setCollapse: action,
      toggleCollapse: action,

      _activePages: observable,
    });

    if (mobxResult.ok === false) {
      this.setState(StateControllerState.MobxError);
      return this;
    }
    this.setState(StateControllerState.Ready);
  }

  /** Returns the ready state of this controller */
  get ready() {
    return this._state === StateControllerState.Ready;
  }

  /**
   * Sets the state of the current controller in a method trackable by MobX
   * @param state - The new state
   */
  setState(state: StateControllerState) {
    this._state = state;
  }

  /**
   * Ensures that a collapse value at the given key is present
   * @param key - The key of the collapse
   * @param defaultValue - The initial value to insert. False by default
   */
  createCollapse(key: string, defaultValue = false) {
    if (!this.ready) return;
    if (this._collapses[key] !== undefined) return;
    this._collapses[key] = defaultValue;
  }

  /**
   * Deletes a collapse from the state
   * @param key - The key of the collapse to remove
   */
  deleteCollapse(key: string) {
    delete this._collapses[key];
  }

  /**
   * Gets the current value of the collapse for the given key
   * @param key - The key of the collapse to get
   * @returns A boolean for the current state of the collapse key,
   *  undefined if not present or not ready
   */
  getCollapse(key: string): boolean | undefined {
    if (!this.ready) return undefined;
    return this._collapses[key];
  }

  /**
   * Sets the collapse to be a specific value
   * @param key - The key of the value to set
   * @param value - The new value to set
   */
  setCollapse(key: string, value: boolean) {
    if (!this.ready) return;
    // Do nothing if this collapse hasn't been initialized; prevents memory leaks
    if (this._collapses[key] === undefined) return;
    this._collapses[key] = value;
  }

  /**
   * Attempts to toggle the collapse value. Does nothing if the collapse does not exist
   * @param key - The collapse key to toggle
   */
  toggleCollapse(key: string) {
    if (!this.ready) return;
    const currentValue = this._collapses[key];
    if (currentValue === undefined) return;
    this._collapses[key] = !currentValue;
  }
}
