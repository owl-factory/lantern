import { CoreDocument } from "./CoreDocument";
import { Severity, getModelForClass, modelOptions } from "@typegoose/typegoose";

/**
 * Describes an organization that may own official or third-party content
 */
@modelOptions({ schemaOptions: { collection: "organizations" }, options: { allowMixed: Severity.ALLOW } } )
export class OrganizationDoc extends CoreDocument {
}

export const OrganizationModel = getModelForClass(OrganizationDoc);
