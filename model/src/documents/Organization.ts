import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * Describes an organization that may own official or third-party content
 */
export class Organization extends CoreDocument {
}

export const OrganizationModel = getModelForClass(Organization);
