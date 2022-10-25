// A persistent state that can traverse down the initial sheet parsing. This is not the same
// as the state used within the renders via the getState and setState functions but information that
// the descriptors should have at parse time, like their keys
export interface SheetState {
  key: string;
}
