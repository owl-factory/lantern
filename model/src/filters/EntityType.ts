import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

@InputType()
export class EntityTypeFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  commonEntityTypeID?: IDFilters;
}