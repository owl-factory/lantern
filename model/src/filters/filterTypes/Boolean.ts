import { Field, InputType } from "type-graphql";

/**
 * The standard filters for filtering booleans
 */
@InputType()
export class BooleanFilters {
  @Field(() => Boolean, { nullable: true })
  eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  neq?: boolean;
}