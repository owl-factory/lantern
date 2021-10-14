import { MessageDocument } from "types/documents";
import { Dispatch, DispatchEvent, GameState, HostPriorityQueue } from "types/reroll/play";
import { rest } from "utilities/request";
import { GameServer } from "controllers/play";

/**
* Updates the game state from the given action
* @param state The previous game state
* @param action The action taken with data and type
*/
export function dispatch(this: GameServer, newDispatch: Dispatch): void {
  let addToHistory = true;
  newDispatch.dispatchedAt = new Date();
  switch (newDispatch.event) {
    case DispatchEvent.PushHostQueue:
      addToHistory = false;
      this.addToHostQueue(newDispatch.content as HostPriorityQueue);
      break;
    case DispatchEvent.CleanHistory:
      addToHistory = false;
      this.cleanDispatchHistory(newDispatch.content as string[]);
      break;
    case DispatchEvent.FullGamestate:
      addToHistory = false;
      this.state = newDispatch.content as GameState;
      this.onLoad();
      break;

    case DispatchEvent.Test:
      this.state.count = newDispatch.content as number;
      break;
    case DispatchEvent.Message:
      if (!(newDispatch.content as MessageDocument).createdAt) {
        (newDispatch.content as MessageDocument).createdAt = newDispatch.dispatchedAt;
      }
      this.state.messages.push(newDispatch.content as MessageDocument);
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(newDispatch);
      console.error(`Dispatch event '${newDispatch.event}' is invalid`);
      addToHistory = false;
      break;
  }

  if ( addToHistory ) { this.dispatchHistory.push(newDispatch); }
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
    console.log(res);
    if (!res.success) { return; }
    for(let i = 0; i < length; i++) {
      const dispatchItem = this.dispatchHistory[i];
      if (!dispatchItem.fuid) { continue; }
      flushedFUIDs.push(dispatchItem.fuid);
    }
    this.sendToAll({event: DispatchEvent.CleanHistory, content: flushedFUIDs});
  })
  .catch((err: any) => {
    console.log(err);
  });
}

/**
 * Clears out dispatch history
 * @param flushedFUIDs The fake unqiue ids that we should remove
 */
export function cleanDispatchHistory(this: GameServer, flushedFUIDs: string[]): void {
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
