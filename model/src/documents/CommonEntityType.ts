import { ObjectType } from "type-graphql";
import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * A document model for entity types common between game systems
 */
@ObjectType()
export class CommonEntityType extends CoreDocument {
}

export const CommonEntityTypeModel = getModelForClass(CommonEntityType);
