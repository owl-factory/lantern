
import { MessageDocument } from "types/documents";

// Describes the different kinds of events that may be used in a dispatch
// TODO - review
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

// The base dispatch object. Meant to be extended for working with a specific dispatch event
interface BaseDispatch {
  // A fake unique id. This is not stored into the database, but as an in-game way of tracking
  // unique events.
  fuid?: string;
  event: DispatchEvent; // The type of event that describes this dispatch
  content: unknown; // TODO for more specific types,
  dispatchedAt?: Date;
}

export interface MessageDispatch extends BaseDispatch {
  event: DispatchEvent.Message;
  content: MessageDocument;
}

// Indicates the type of action we're taking on a dispatch event
export type Dispatch = BaseDispatch | MessageDispatch

/**
 * Describes an item in the Priority Queue for a host
 */
 export interface HostPriorityQueue {
  peerID: string; // The id of the peer client
  isHost: boolean; // Truthy if this peer is the host
  priority: number; // The priority of the host, as calculated on load
}

// The state used to keep track of any information that is changeable by player action
export interface GameState {
  activePlayers: number; // The number of active players. TODO - replace with a list of the current players and
  count: number; // A value for testing
  entities: Record<string, any>;
  messages: MessageDocument[]; // A list of all messages received
  // myEntities: Entity[]; // A list of entity ids that we have access to
}
