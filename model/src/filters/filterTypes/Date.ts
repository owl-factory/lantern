import { Field, InputType } from "type-graphql";

/**
 * The standard filters for filtering dates
 */
@InputType()
export class DateFilters {
  @Field(() => Date, { nullable: true })
  eq?: Date;

  @Field(() => Date, { nullable: true })
  neq?: Date;

  @Field(() => Date, { nullable: true })
  gt?: Date;

  @Field(() => Date, { nullable: true })
  gte?: Date;

  @Field(() => Date, { nullable: true })
  lt?: Date;

  @Field(() => Date, { nullable: true })
  lte?: Date;
}
