import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

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
