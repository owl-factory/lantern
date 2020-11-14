import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

/**
 * Describes the various filters that may be applied to campaign documents for searching
 */
@InputType()
export class CampaignFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;
}

/**
 * Extends the original filters to have the base filters and any additional or operators
 */
@InputType()
export class CampaignFilters extends CampaignFilter {
  @Field(() => [CampaignFilter], { nullable: true })
  or?: CampaignFilter[];
}