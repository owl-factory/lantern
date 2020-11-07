import { ObjectType } from "type-graphql";
import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * A document model representing the core fields common between content type
 */
@ObjectType()
export class CommonContentType extends CoreDocument {
}

export const CommonContentTypeModel = getModelForClass(CommonContentType);
