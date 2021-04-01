import { prop, Ref } from "@typegoose/typegoose";
import { CoreDocument } from "types/documents/CoreDocument";
import { UserProfileDoc } from "types";

enum MessageType {
  Text,

}

export class MessageDoc extends CoreDocument {
  @prop({ ref: "userProfiles"})
  author: Ref<UserProfileDoc>;

  // Name used for the messager name
  @prop({ enum: MessageType, type: Number })
  type?: MessageType;

  @prop()
  content?: string;
}
