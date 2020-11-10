import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to user documents for searching
 */
@InputType()
export class UserFilter extends CoreFilter { 
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class UserFilters extends UserFilter {
  @Field(() => [UserFilter], { nullable: true })
  or?: UserFilter[];
}