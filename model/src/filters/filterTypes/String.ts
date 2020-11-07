import { Field, InputType } from "type-graphql";

/**
 * The standard filters for filtering strings
 */
@InputType()
export class StringFilters {
  @Field({ nullable: true })
  $eq?: string;

  @Field({ nullable: true })
  $neq?: string;

  @Field({ nullable: true })
  $like?: string;

  // Excludes stuff. Maybe unused?
  @Field({ nullable: true })
  $unlike?: string;
}