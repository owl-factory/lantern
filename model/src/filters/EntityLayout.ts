import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to entity layout documents for searching
 */
@InputType()
export class EntityLayoutFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class EntityLayoutFilters extends EntityLayoutFilter {
  @Field(() => [EntityLayoutFilter], { nullable: true })
  or?: EntityLayoutFilter[];
}