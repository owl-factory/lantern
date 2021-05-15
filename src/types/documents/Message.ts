import { CampaignDocument, CoreDocument } from "types/documents";
import { UserDocument } from "./User";

export enum MessageType {
  Text,
}

export interface MessageDocument extends CoreDocument {
  campaign?: CampaignDocument;

  // The user who sent the message
  author?: UserDocument;

  // Name used for the messager name
  sendAs?: string;

  type?: MessageType;

  // The text content of the message
  content?: string;

  // A value for rendering messages
  isSmoothed?: boolean;

}
