import { Field, InputType } from "type-graphql";

/**
 * The standard filters for filtering numbers
 */
@InputType()
export class NumberFilters {
  @Field(() => Number, { nullable: true })
  eq?: number;

  @Field(() => Number, { nullable: true })
  neq?: number;

  @Field(() => Number, { nullable: true })
  gt?: number;

  @Field(() => Number, { nullable: true })
  gte?: number;

  @Field(() => Number, { nullable: true })
  lt?: number;

  @Field(() => Number, { nullable: true })
  lte?: number;
}
