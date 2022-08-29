import { Auth } from "controllers/auth";
import { ChatFormValues } from "../types/form";
import { ChatMessage } from "../types/message";
import { parsePostedAt } from "./time";

/**
 * Parses a raw message into a partial Chat Message
 * @param as The actor that is posting the message.
 * @param rawMessage The raw text message to parse into a partial ChatMessage
 */
export function parseChatMessage(values: ChatFormValues): ChatMessage {
  const message: Partial<ChatMessage> = {};
  message.rawMessage = values.message;
  message.postedAt = new Date();
  const parsedDate = parsePostedAt(message.postedAt);

  message.readableDate = parsedDate.readable;
  message.fullDate = parsedDate.fullDate;

  if (Auth.ref) {
    message.author = { ref: Auth.ref };
    message.name = Auth.user?.name || "Guest";
    // TODO - include imgs here
  }
  if (values.as) {
    message.as = { ref: values.as };
  }

  message.text = values.message; // TODO - expand later

  return message as ChatMessage;
}
