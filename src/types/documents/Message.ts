import { Ref, prop } from "@typegoose/typegoose";
import { CoreDocument } from "types/documents/CoreDocument";
import { CampaignDoc, UserProfileDoc } from "types";

export enum MessageType {
  Text,
}

export class MessageDoc extends CoreDocument {
  @prop({ ref: "campaigns" })
  campaign: Ref<CampaignDoc>;

  // The user who sent the message
  @prop({ ref: "userProfiles"})
  author: Ref<UserProfileDoc>;

  // Name used for the messager name
  @prop({ enum: MessageType, type: Number })
  type?: MessageType;

  // The text content of the message
  @prop()
  content?: string;
}
