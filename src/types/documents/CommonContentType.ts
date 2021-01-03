import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * A document model representing the core fields common between content type
 */
export class CommonContentType extends CoreDocument {
}

export const CommonContentTypeModel = getModelForClass(CommonContentType);
