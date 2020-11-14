import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to module documents for searching
 */
@InputType()
export class ModuleFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class ModuleFilters extends ModuleFilter {
  @Field(() => [ModuleFilter], { nullable: true })
  or?: ModuleFilter[];
}