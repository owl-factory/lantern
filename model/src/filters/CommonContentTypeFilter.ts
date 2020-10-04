import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Filters for searching CommonContentTypes
 */
@InputType()
export class CommonContentTypeFilter extends CoreFilter {
  // Description filters
  @Field({ nullable: true })
  description_eq?: string;

  @Field({ nullable: true })
  description_neq?: string;

  @Field({ nullable: true })
  description_like?: string;
}