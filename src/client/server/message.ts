import { DispatchEvent } from "types";
import { GameServer } from "./GameServer";

export function fireTextMessage(this: GameServer, message: any) {
  
  message.author = this.user._id;
  const dispatch = { event: DispatchEvent.Message, content: message };
  console.log(message)
}