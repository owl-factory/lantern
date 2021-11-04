import { Dispatch } from "types/reroll/play";
import { GameServer } from "controllers/play";

/**
 * Sends packaged data to all users
 * @param data The data to send to all people
 * TODO - move to dispatch?
 */
export function sendToAll(this: GameServer, newDispatch: Dispatch): void {
  newDispatch.fuid = (Math.random() * Number.MAX_SAFE_INTEGER).toString();
  const keys = Object.keys(this.channels);
  keys.forEach((key: string) => {
    const channel = this.channels[key];
    channel.send(newDispatch);
  });
  this.dispatch(newDispatch);
}
