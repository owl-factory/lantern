import { CoreDocument } from "./CoreDocument"
import { getModelForClass } from "@typegoose/typegoose";
import { ObjectType } from "type-graphql";

/**
 * Describes an organization that may own official or third-party content
 */
@ObjectType()
export class Organization extends CoreDocument {
}

export const OrganizationModel = getModelForClass(Organization);
