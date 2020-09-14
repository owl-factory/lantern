import { Field, ID, ObjectType } from "type-graphql";
import { Filter } from "type-graphql-filter";
import { idFilters } from "../filterTypes";

@ObjectType()
export class CoreDocument {
  @Field(() => ID)
  @Filter(idFilters)
  _id: string;
}