import { getModelForClass, prop } from "@typegoose/typegoose";
import { CommonEntityType } from "./CommonEntityType";

/**
 * Describes the different entity types that exist within a game system, such as a
 * character or NPC or container.
 */
export class EntityType extends CommonEntityType {
  @prop({ required: true })
  gameSystemID?: string;

  @prop()
  commonEntityTypeID?: string;
}
export const EntityTypeModel = getModelForClass(EntityType);
