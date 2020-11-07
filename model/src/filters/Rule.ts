import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

@InputType()
export class RuleFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;
}