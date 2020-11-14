import { InputType } from "type-graphql";
import { Organization } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the organization document
 */
@InputType()
export class OrganizationInput extends CoreInput implements Partial<Organization> {
}

@InputType()
export class CreateOrganizationInput extends OrganizationInput implements Partial<Organization>{}
@InputType()
export class UpdateOrganizationInput extends OrganizationInput implements Partial<Organization>{}