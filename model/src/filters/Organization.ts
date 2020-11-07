import { InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to organization documents for searching
 */
@InputType()
export class OrganizationFilter extends CoreFilter { 
}