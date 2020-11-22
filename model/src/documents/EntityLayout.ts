import { CoreDocument } from "./CoreDocument"
import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

/**
 * A model describing the layout of entities
 */
@ObjectType()
export class EntityLayout extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID?: string;
}

export const EntityLayoutModel = getModelForClass(EntityLayout);
