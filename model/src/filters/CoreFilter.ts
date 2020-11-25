import { Field, InputType } from "type-graphql";
import { DateFilters, IDFilters, StringFilters } from "./filterTypes";

@InputType()
export class CoreFilter {
  @Field(() => IDFilters, { nullable: true })
  _id?: IDFilters;

  @Field(() => StringFilters, { nullable: true })
  name?: StringFilters;

  @Field(() => StringFilters, { nullable: true })
  alias?: StringFilters;

  @Field(() => IDFilters, { nullable: true })
  ownedBy?: IDFilters;

  @Field(() => IDFilters, { nullable: true })
  createdBy?: IDFilters;

  @Field(() => DateFilters, { nullable: true })
  createdAt?: DateFilters;

  @Field(() => IDFilters, { nullable: true })
  updatedBy?: IDFilters;

  @Field(() => DateFilters, { nullable: true })
  updatedAt?: DateFilters;

  @Field(() => IDFilters, { nullable: true })
  deletedBy?: IDFilters;

  @Field(() => DateFilters, { nullable: true })
  deletedAt?: DateFilters;
}
