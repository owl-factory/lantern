import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";
import { ObjectType } from "type-graphql";

/**
 * A model for describing a generic-type asset, which may be an image or sound
 */
@ObjectType()
export class Asset extends CoreDocument {
}

export const AssetModel = getModelForClass(Asset);
