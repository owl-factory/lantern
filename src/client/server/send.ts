import { GameServer } from ".";

/**
 * Sends packaged data to all users
 * @param data The data to send to all people
 */
export function sendToAll(this: GameServer, data: any): void {
  const keys = Object.keys(this.channels);
  keys.forEach((key: string) => {
    const channel = this.channels[key];
    channel.send(data);
  });
  this.dispatch(data);
}
