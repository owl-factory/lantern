import { Dispatch, DispatchEvent } from "components/reroll/play";
import { rest } from "utilities";
import { GameServer } from ".";

/**
* Updates the game state from the given action
* @param state The previous game state
* @param action The action taken with data and type
*/
export function dispatch(this: GameServer, newDispatch: Dispatch): void {
  let addToHistory = true;
  switch (newDispatch.event) {
    case DispatchEvent.PushHostQueue:
      this.addToHostQueue(newDispatch.content);
      break;
    case DispatchEvent.Flush:
      addToHistory = false;
      this.flushDispatch();
      break;
    case DispatchEvent.FullGamestate:
      this.gameState = newDispatch.content;
      this.onLoad();
      break;

    case DispatchEvent.Test:
      this.gameState.count = newDispatch.content;
      break;
    case DispatchEvent.Message:
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


export function flushDispatch(this: GameServer) {
  if (this.gameState.host !== this.peerID) { return; }
  // const lastestTimestamp = 
  // rest.patch(`/api/play/${this.campaignID}`, )
}