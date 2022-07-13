import { action, makeObservable, observable } from "mobx";
import { Scalar } from "types";
import { StateType } from "../enums/stateTypes";

// Handles the state for each render of a sheet, allowing for local consistency but not saved to a database
export class StateController {
  public $state: Record<string, Record<StateType, Record<string, Scalar>>> = {};

  constructor() {
    makeObservable(this, {
      $state: observable,
      setState: action,
    });
  }

  /**
   * Fetches the state from the state controller
   * @param renderID The render ID the state is used for
   * @param stateType The type of state being fetched
   * @param key The key of the state to fetch
   * @returns The found state value. Undefined if none is found
   */
  public getState(renderID: string, stateType: StateType, key: string): Scalar | undefined {
    if (!(renderID in this.$state) || !(stateType in this.$state[renderID])) { return undefined; }
    return this.$state[renderID][stateType][key];
  }

  /**
   * Sets a value within the state
   * @param renderID The render ID the state is used for
   * @param stateType The type of state being set
   * @param key The key of the state to set
   * @param value The new value to set in the state
   */
  public setState(renderID: string, stateType: StateType, key: string, value: Scalar) {
    if (!(renderID in this.$state)) {
      this.$state[renderID] = {
        [StateType.Collapse]: {},
        [StateType.CurrentPage]: {},
      };
    }
    this.$state[renderID][stateType][key] = value;
  }
}
