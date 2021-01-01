import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

/**
 * A model describing the layout of entities
 */
export class EntityLayout extends CoreDocument {
    @prop({ required: true })
  gameSystemID?: string;
}

export const EntityLayoutModel = getModelForClass(EntityLayout);
