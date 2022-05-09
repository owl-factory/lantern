import { Ref64 } from "@owl-factory/types";
import { CampaignDocument, BaseDocument, UserDocument } from "types/documents";

export enum MessageType {
  Text,
}

export interface MessageDocument extends BaseDocument {
  campaign?: { ref: Ref64; };

  // The user who sent the message
  author?: { ref: Ref64; };

  // Name used for the messager name
  sendAs?: string;

  type?: MessageType;

  // The text content of the message
  content?: string;

  // A value for rendering messages
  isSmoothed?: boolean;

}
