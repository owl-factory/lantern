import { DispatchEvent } from "types/lantern/play";
import { OldMessageDocument } from "types/documents";
import { GameServer } from "controllers/play";

export function fireTextMessage(this: GameServer, message: OldMessageDocument): void {
  const dispatch = { event: DispatchEvent.Message, content: message, dispatchedAt: new Date() };
  this.dispatchToAll(dispatch);
}
