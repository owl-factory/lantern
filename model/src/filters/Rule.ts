import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to rule documents for searching
 */
@InputType()
export class RuleFilter extends CoreFilter {
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class RuleFilters extends RuleFilter {
  @Field(() => [RuleFilter], { nullable: true })
  or?: RuleFilter[];
}
