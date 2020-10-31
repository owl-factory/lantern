import { ObjectType, Field } from "type-graphql";
import { CoreDocument } from "./CoreDocument";
import { prop, getModelForClass } from "@typegoose/typegoose";

/**
 * A document model representing the core fields common between content type
 */
@ObjectType()
export class CommonContentType extends CoreDocument {
  @Field()
  @prop({ default: "" })
  description?: string;
}

export const CommonContentTypeModel = getModelForClass(CommonContentType);
