import { DispatchEvent, MessageDoc } from "types";
import { GameServer } from "./GameServer";

export function fireTextMessage(this: GameServer, message: MessageDoc): void {
  message.author = this.user._id;
  const dispatch = { event: DispatchEvent.Message, content: message, dispatchedAt: new Date() };
  this.dispatchToAll(dispatch);
}
