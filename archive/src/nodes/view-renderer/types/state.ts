// A persistent state that can traverse down the initial sheet parsing. This is not the same
// as the state used within the renders via the getState and setState functions but information that

import { StateType } from "../enums/stateType";

// the descriptors should have at parse time, like their keys
export interface ParseState {
  key: string;
}

// The state used for tracking in a render
export interface RenderState {
  // An object of the collapse elements and whether they are open or closed
  [StateType.Collapse]: Record<string, boolean>;
  [StateType.CurrentPage]: Record<string, number>; // An object of pageGroup IDs and their active page name
}
