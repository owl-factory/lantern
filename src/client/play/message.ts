import { DispatchEvent } from "types/reroll/play";
import { MessageDocument } from "types/documents";
import { GameServer } from "./GameServer";

export function fireTextMessage(this: GameServer, message: MessageDocument): void {
  // message.author = new UserDocument(this.user.id as string);
  const dispatch = { event: DispatchEvent.Message, content: message, dispatchedAt: new Date() };
  this.sendToAll(dispatch);
}
