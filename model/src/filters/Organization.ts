import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to organization documents for searching
 */
@InputType()
export class OrganizationFilter extends CoreFilter {
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class OrganizationFilters extends OrganizationFilter {
  @Field(() => [OrganizationFilter], { nullable: true })
  or?: OrganizationFilter[];
}
