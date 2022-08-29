import { Ref64 } from "@owl-factory/types";
import { MessageType } from "types/documents";

export interface ChatMessage {
  name: string; // The name of who posted the message
  author: { ref: Ref64; };
  as?: { ref: Ref64; };
  postedAt: Date; // The time this was posted
  type: MessageType; // The type of message this is, instructing on how it should be processed
  rawMessage: string; // The original message

  readableDate: string; // The readable date of when this was posted
  fullDate: string; // The fully expanded date time of when this was posted

  text?: string; // The text of the message, if any
}
