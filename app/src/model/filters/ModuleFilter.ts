import { Field, InputType, ID, Int } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * Filters for searching through Modules
 */
@InputType()
export class ModuleFilter extends CoreFilter {
  // GameSystemID filters
  @Field(() => ID, { nullable: true })
  gameSystemID_eq?: string;

  @Field(() => ID, { nullable: true })
  gameSystemID_neq?: string;

  // PublishType filters
  @Field(() => Int, { nullable: true })
  publishType_eq?: string;

  @Field(() => Int, { nullable: true })
  publishType_neq?: string;

  @Field(() => Int, { nullable: true })
  publishType_like?: string;

  // Description filters
  @Field({ nullable: true })
  description_eq?: string;

  @Field({ nullable: true })
  description_neq?: string;

  @Field({ nullable: true })
  description_like?: string;

  // IsPublished filters
  @Field(() => Boolean, { nullable: true })
  isPublished_eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPublished_neq?: boolean;

  // IsPurchasable filters
  @Field(() => Boolean, { nullable: true })
  isPurchasable_eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPurchasable_neq?: boolean;

  // Cost filters
  @Field(() => Int, { nullable: true })
  cost_eq?: number;

  @Field(() => Int, { nullable: true })
  cost_neq?: number;

  @Field(() => Int, { nullable: true })
  cost_gt?: number;

  @Field(() => Int, { nullable: true })
  cost_gte?: number;

  @Field(() => Int, { nullable: true })
  cost_lt?: number;

  @Field(() => Int, { nullable: true })
  cost_lte?: number;
}