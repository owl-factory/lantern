import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * A document model for entity types common between game systems
 */
export class CommonEntityType extends CoreDocument {
}

export const CommonEntityTypeModel = getModelForClass(CommonEntityType);
