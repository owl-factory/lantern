import { CoreDocument } from "./CoreDocument"
import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

/**
 * Describes a piece of content with dynamic and editable data, such as a character or NPC
 */
@ObjectType()
export class Entity extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID?: string;

  @Field(() => ID)
  @prop({ required: true })
  entityTypeID?: string;
}

export const EntityModel = getModelForClass(Entity);
