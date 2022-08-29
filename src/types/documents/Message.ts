import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "types/documents";

export enum MessageType {
  Text,
}

// An old message document version. Kept to prevent breaks in other areas
export interface OldMessageDocument extends BaseDocument {
  campaign?: { ref: Ref64; };

  // The user who sent the message
  author?: { ref: Ref64; };

  // Name used for the messager name
  actor?: string;

  type?: MessageType;

  // The text content of the message
  content?: string;

  // A value for merging messages from the same person in a similar timeframe
  isSmoothed?: boolean;

}

// A new version of the Message Document
export interface MessageDocument extends BaseDocument {
  author: { ref: Ref64; }; // Author is required for saving, but may not be for regular chattings
  campaign: { ref: Ref64; }; // Campaign is required for saving. This may be changed in the future.
  // The actor ref and their name at the time of posting
  actor?: {
    ref: Ref64;
    name: string;
  }
  type: MessageType; // The type of message that this is
  text?: string; // The simple text value

  postedAt: Date; // The datetime that this was posted
}
