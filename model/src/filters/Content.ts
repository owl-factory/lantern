import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";
import { IDFilters } from "./filterTypes";

@InputType()
export class ContentFilter extends CoreFilter { 
  @Field(() => IDFilters, { nullable: true })
  gameSystemID?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  contentTypeID?: IDFilters;
}