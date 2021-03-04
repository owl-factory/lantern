import { CoreDocument } from "./CoreDocument";
import { prop } from "@typegoose/typegoose";

/**
 * Describes a piece of content with dynamic and editable data, such as a character or NPC
 */
export class Entity extends CoreDocument {
  @prop({ required: true })
  gameSystemID?: string;

  @prop({ required: true })
  entityTypeID?: string;
}

