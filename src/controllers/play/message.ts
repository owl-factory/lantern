import { DispatchEvent } from "types/reroll/play";
import { MessageDocument } from "types/documents";
import { GameServer } from "controllers/play";

export function fireTextMessage(this: GameServer, message: MessageDocument): void {
  const dispatch = { event: DispatchEvent.Message, content: message, dispatchedAt: new Date() };
  this.sendToAll(dispatch);
}
