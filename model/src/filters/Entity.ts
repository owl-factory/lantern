import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to entity documents for searching
 */
@InputType()
export class EntityFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  entityTypeID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class EntityFilters extends EntityFilter {
  or?: EntityFilter[];
}