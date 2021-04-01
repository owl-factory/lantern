import { Dispatch } from "components/reroll/play";
import { GameServer } from ".";

/**
 * Sends packaged data to all users
 * @param data The data to send to all people
 */
export function sendToAll(this: GameServer, newDispatch: Dispatch): void {
  newDispatch.timestamp = (new Date()).getTime();
  const keys = Object.keys(this.channels);
  keys.forEach((key: string) => {
    const channel = this.channels[key];
    channel.send(newDispatch);
  });
  this.dispatch(newDispatch);
}
