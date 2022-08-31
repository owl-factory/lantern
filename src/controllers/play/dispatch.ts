import { OldMessageDocument } from "types/documents";
import { Dispatch, DispatchEvent, GameState, HistoricalDispatch, HostPriorityQueue } from "types/reroll/play";
import { GameServer } from "controllers/play";
import { rest } from "@owl-factory/https";

export interface RawDispatch {
  fuid?: string;
  event: DispatchEvent;
  content: unknown;
  dispatchedAt?: Date;
}

/**
 * Builds a dispatch and validates it.
 * @param rawDispatch The raw dispatch to validate and prepare
 */
export function buildDispatch(this: GameServer, rawDispatch: RawDispatch): Dispatch {
  if (!rawDispatch.dispatchedAt) { rawDispatch.dispatchedAt = new Date(); }
  if (!rawDispatch.fuid) { rawDispatch.fuid = (Math.random() * Number.MAX_SAFE_INTEGER).toString(); }
  return rawDispatch;
}

/**
 * Dispatches a dispatch object to all players
 * @param rawDispatch The raw dispatch to process before sending
 * @param localDispatch True if this dispatch should be run locally
 */
export function dispatchToAll(this: GameServer, rawDispatch: RawDispatch, localDispatch = true): void {
  const dispatch = this.buildDispatch(rawDispatch);
  const keys = Object.keys(this.channels);
  keys.forEach((key: string) => {
    this.dispatchToOne(key, dispatch, false);
  });
  if (localDispatch) { this.handleDispatch(dispatch); }
}

/**
 * Dispatches an object to a single player
 * @param targetPeer The target peer ID to send the object to
 * @param rawDispatch The raw dispatch to process before sending
 * @param localDispatch Truthy if this dispatch should be run locally
 */
export function dispatchToOne(
  this: GameServer,
  targetPeer: string,
  rawDispatch: RawDispatch,
  localDispatch = true
): void {
  const dispatch = this.buildDispatch(rawDispatch);
  const channel = this.channels[targetPeer];
  if (!channel) { console.error(`The given peer ID was not found`); return; }
  channel.send(dispatch);
  if (localDispatch) { this.handleDispatch(dispatch); }
}

/**
* Updates the game state from the given action
* @param state The previous game state
* @param action The action taken with data and type
*/
export function handleDispatch(this: GameServer, dispatch: Dispatch): void {
  dispatch.dispatchedAt = new Date();
  switch (dispatch.event) {
    // SERVER MANAGEMENT
    // Post Host Queue
    case DispatchEvent.HostQueueItem:
      console.log(dispatch)
      this.addToHostQueue(dispatch.content as HostPriorityQueue);
      break;

    case DispatchEvent.DispatchHistory:
      this.receiveDispatchHistory(dispatch as HistoricalDispatch);
      break;

    case DispatchEvent.CleanHistory:
      this.flushDispatchHistory(dispatch.content as string[]);
      break;

    // MESSAGES

    case DispatchEvent.Test:
      this.state.count = dispatch.content as number;
      break;
    case DispatchEvent.Message:
      // TODO
      // if (!(newDispatch.content as MessageDocument).createdAt) {
      //   (newDispatch.content as MessageDocument).createdAt = newDispatch.dispatchedAt;
      // }
      // this.state.messages.push(newDispatch.content as MessageDocument);
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(dispatch);
      // eslint-disable-next-line no-console
      console.error(`Dispatch event '${dispatch.event}' is invalid`);
      break;
  }
}

/**
 * Receieves and processes dispatch history from the host
 * @param dispatch The historical dispatch data
 */
export function receiveDispatchHistory(this: GameServer, dispatch: HistoricalDispatch): void {
  dispatch.content.hostDispatchedAt = new Date(dispatch.content.hostDispatchedAt);
  const serverDifference = dispatch.content.hostDispatchedAt.valueOf() - (dispatch.dispatchedAt as Date).valueOf();

  dispatch.content.history.forEach((dispatchItem: Dispatch) => {
    dispatchItem.dispatchedAt = new Date(
      new Date(dispatchItem.dispatchedAt as Date | string).valueOf() + serverDifference
    );
    this.handleDispatch(dispatchItem);
  });

  dispatch.content.hostQueue.forEach((hostQueueItem: HostPriorityQueue) => {
    this.addToHostQueue(hostQueueItem);
  });
  this.onLoad();
}


/**
 * The function that kicks off the dispatch flush
 */
export function attemptFlush(this: GameServer): void {
  console.log("Attempting flush");
  // Require this to be the host that begins
  if (this.host !== this.peer.id) { return; }
  const flushedFUIDs: string[] = [];

  // Grab the length now to prevent race conditions
  const length = this.dispatchHistory.length;
  if (length === 0) { return; }

  rest.patch(
    `/api/play/${this.campaignID}`,
    {
      dispatchTime: new Date(),
      dispatchHistory: this.dispatchHistory.slice(0, length),
    }
  ).then((res: any) => {
    // Failure on the backends
    if (!res.success) { return; }
    for(let i = 0; i < length; i++) {
      const dispatchItem = this.dispatchHistory[i];
      if (!dispatchItem.fuid) { continue; }
      flushedFUIDs.push(dispatchItem.fuid);
    }
    this.dispatchToAll({event: DispatchEvent.CleanHistory, content: flushedFUIDs});
  });
}

/**
 * Clears out dispatch history
 * @param flushedFUIDs The fake unqiue ids that we should remove
 */
export function flushDispatchHistory(this: GameServer, flushedFUIDs: string[]): void {
  this.log("Flushing!");
  flushedFUIDs.forEach((fuid: string) => {
    for(let i = 0; i < this.dispatchHistory.length; i++) {
      if (this.dispatchHistory[i].fuid === fuid) {
        this.dispatchHistory.splice(i, 1);
        break;
      }
    }
  });
}
