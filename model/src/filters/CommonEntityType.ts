import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to common entity type documents for searching
 */
@InputType()
export class CommonEntityTypeFilter extends CoreFilter {
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class CommonEntityTypeFilters extends CommonEntityTypeFilter {
  @Field(() => [CommonEntityTypeFilter], { nullable: true })
  or?: CommonEntityTypeFilter[];
}
