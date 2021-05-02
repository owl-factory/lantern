import { Model } from "types/documents/CoreDocument";
import { CampaignModel } from "types";
import { UserModel } from "./User";

export enum MessageType {
  Text,
}

export class MessageModel extends Model {
  campaign?: CampaignModel;

  // The user who sent the message
  author?: UserModel;

  sendAs?: string;

  // Name used for the messager name
  type?: MessageType;

  // The text content of the message
  content?: string;

  // A value for rendering messages
  isSmoothed?: boolean;

}
