import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

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
