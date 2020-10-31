import { ObjectType, Field } from "type-graphql";
import { CoreDocument } from "./CoreDocument";
import { prop, getModelForClass } from "@typegoose/typegoose";

/**
 * A document model for entity types common between game systems
 */
@ObjectType()
export class CommonEntityType extends CoreDocument {
  @Field()
  @prop({ default: "" })
  description?: string;
}

export const CommonEntityTypeModel = getModelForClass(CommonEntityType);
