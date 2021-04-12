import { DispatchEvent } from "types";
import { GameServer } from "./GameServer";

export function fireTextMessage(this: GameServer, message: any): void {
  message.author = this.user._id;
  const dispatch = { event: DispatchEvent.Message, content: message };
  this.sendToAll(dispatch);
}
