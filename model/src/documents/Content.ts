import { CoreDocument } from "./CoreDocument"
import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID, Int } from "type-graphql";

/**
 * A model describing the Content document, which contains the static information
 * about items within a game system--for example, the spell 'Fireball'.
 */
@ObjectType()
export class Content extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID?: string;

  @Field(() => ID)
  @prop({ required: true })
  contentTypeID?: string;
}

export const ContentModel = getModelForClass(Content);
