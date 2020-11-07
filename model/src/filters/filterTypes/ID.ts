import { Field, ID, InputType } from "type-graphql";

/**
 * The standard filters for filtering IDs
 */
@InputType()
export class IDFilters {
  @Field(() => ID, { nullable: true })
  eq?: string;

  @Field(() => ID, { nullable: true })
  neq?: string;
}