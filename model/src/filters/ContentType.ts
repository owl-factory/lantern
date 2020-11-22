import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to content type documents for searching
 */
@InputType()
export class ContentTypeFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  commonContentTypeID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class ContentTypeFilters extends ContentTypeFilter {
  @Field(() => [ContentTypeFilter], { nullable: true })
  or?: ContentTypeFilter[];
}