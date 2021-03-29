import { Action, GameServer } from ".";

/**
* Updates the game state from the given action
* @param state The previous game state
* @param action The action taken with data and type
*/
export function dispatch(this: GameServer, action: Action): void {
  switch (action.type) {
    case "full gamestate":
      this.gameState = action.data;
      this.onLoad();
      break;
    case "push host queue":
      this.addToHostQueue(action.data);
      break;
    case "set count":
      this.gameState.count = action.data;
      break;
    case "add message":
      this.gameState.messages.push(action.data);
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`Action '${action.type}' is invalid`);
      break;
  }
}
