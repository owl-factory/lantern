import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";

/**
 * A model describing the Content document, which contains the static information
 * about items within a game system--for example, the spell 'Fireball'.
 */
export class Content extends CoreDocument {
  @prop({ required: true })
  gameSystemID?: string;

  @prop({ required: true })
  contentTypeID?: string;

  @prop({ required: true })
  data!: Record<string, string>;
}


export const ContentModel = getModelForClass(Content);
