import { InputType, Field } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Filters for searching ContentTypes
 */
@InputType()
export class ContentTypeFilter extends CoreFilter {
  // gameSystemID filters
  @Field({ nullable: true })
  gameSystemID_eq?: string;

  @Field({ nullable: true })
  gameSystemID_neq?: string;

  // Common Content Type ID
  @Field({ nullable: true })
  commonContentTypeID_eq?: string;

  @Field({ nullable: true })
  commonContentTypeID_neq?: string;

  // isTypeOnly filters
  @Field(() => Boolean, { nullable: true })
  isTypeOnly_eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  isTypeOnly_neq?: boolean;

  // Common Content Type ID
  // TODO - expand on this. Right now it works for checking if a warning is null or not
  @Field({ nullable: true })
  warnings_eq?: string;

  @Field({ nullable: true })
  warnings_neq?: string;
}