import { Field, ID, ObjectType } from "type-graphql";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { CommonEntityType } from "./CommonEntityType";

/**
 * Describes the different entity types that exist within a game system, such as a
 * character or NPC or container.
 */
@ObjectType()
export class EntityType extends CommonEntityType {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  @Field(() => ID, { nullable: true })
  @prop()
  commonEntityTypeID: string;
}
export const EntityTypeModel = getModelForClass(EntityType);
