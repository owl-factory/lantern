import { DispatchEvent, MessageModel } from "types";
import { GameServer } from "./GameServer";

export function fireTextMessage(this: GameServer, message: MessageModel): void {
  message.author = new MessageModel(this.user.id as string);
  const dispatch = { event: DispatchEvent.Message, content: message, dispatchedAt: new Date() };
  this.sendToAll(dispatch);
}
