import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to entity types documents for searching
 */
@InputType()
export class EntityTypeFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  commonEntityTypeID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class EntityTypeFilters extends EntityTypeFilter {
  @Field(() => [EntityTypeFilter], { nullable: true })
  or?: EntityTypeFilter[];
}