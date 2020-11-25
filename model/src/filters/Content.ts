import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to content documents for searching
 */
@InputType()
export class ContentFilter extends CoreFilter {
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  contentTypeID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class ContentFilters extends ContentFilter {
  @Field(() => [ContentFilter], { nullable: true })
  or?: ContentFilter[];
}
