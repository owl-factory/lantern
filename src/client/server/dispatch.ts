import { Dispatch, DispatchEvent } from "types";
import { rest } from "utilities";
import { GameServer } from ".";

/**
* Updates the game state from the given action
* @param state The previous game state
* @param action The action taken with data and type
*/
export function dispatch(this: GameServer, newDispatch: Dispatch): void {
  let addToHistory = true;
  newDispatch.timestamp = new Date();
  switch (newDispatch.event) {
    case DispatchEvent.PushHostQueue:
      addToHistory = false;
      this.addToHostQueue(newDispatch.content);
      break;
    case DispatchEvent.CleanHistory:
      addToHistory = false;
      this.cleanDispatchHistory(newDispatch.content);
      break;
    case DispatchEvent.FullGamestate:
      addToHistory = false;
      this.gameState = newDispatch.content;
      this.onLoad();
      break;

    case DispatchEvent.Test:
      this.gameState.count = newDispatch.content;
      break;
    case DispatchEvent.Message:
      console.log(newDispatch)
      this.gameState.messages.push(newDispatch.content);
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(newDispatch);
      console.error(`Dispatch event '${newDispatch.event}' is invalid`);
      addToHistory = false;
      break;
  }

  if ( addToHistory ) { this.gameState.dispatchHistory.push(newDispatch); }
}


/**
 * The function that kicks off the dispatch flush
 */
export function attemptFlush(this: GameServer) {
  console.log("Attempting flush")
  // Require this to be the host that begins
  if (this.gameState.host !== this.peer.id) { console.log("Not host!"); return; }
  const flushedFUIDs: string[] = [];

  // Grab the length now to prevent race conditions
  const length = this.gameState.dispatchHistory.length;
  if (length === 0) { return; }

  rest.patch(
    `/api/play/${this.campaignID}`,
    {
      dispatchTime: new Date(),
      dispatchHistory: this.gameState.dispatchHistory.slice(0, length),
    }
  ).then((res: any) => {
    // Failure on the backends
    console.log(res);
    if (!res.success) { return; }
    for(let i = 0; i < length; i++) {
      const dispatchItem = this.gameState.dispatchHistory[i];
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
export function cleanDispatchHistory(this: GameServer, flushedFUIDs: string[]) {
  this.log("Flushing!");
  flushedFUIDs.forEach((fuid: string) => {
    for(let i = 0; i < this.gameState.dispatchHistory.length; i++) {
      if (this.gameState.dispatchHistory[i].fuid === fuid) {
        this.gameState.dispatchHistory.splice(i, 1);
        break;
      }
    }
  });
}
