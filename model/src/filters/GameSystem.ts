import { Field, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Describes the various filters that may be applied to game system documents for searching
 */
@InputType()
class GameSystemFilter extends CoreFilter { 
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class GameSystemFilters extends GameSystemFilter {
  @Field(() => [GameSystemFilter], { nullable: true })
  or?: GameSystemFilter[];
}