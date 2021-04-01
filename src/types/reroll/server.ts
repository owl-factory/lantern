export enum DispatchEvent {
  // Game Handlers
  PushHostQueue,
  FullGamestate, // TODO - remove in the future
  CatchUp,
  CleanHistory,

  // User Actions
  Test,
  Message,
}

// Indicates the type of action we're taking on a dispatch event
export interface Dispatch {
  // A fake unique id. This is not stored into the database, but as an in-game way of tracking
  // unique events.
  fuid?: string;
  event: DispatchEvent;
  content: any; // TODO for more specific types,
  timestamp?: number;
}
