import { ArgsType, Field, Int, ID, InputType } from "type-graphql";
import { CoreFilter } from "./CoreFilter";

/**
 * The filters for the Game Systems
 */
@InputType()
export class GameSystemFilter extends CoreFilter {
  // Description filters
  @Field({ nullable: true })
  description_eq?: string;

  @Field({ nullable: true })
  description_neq?: string;

  @Field({ nullable: true })
  description_like?: string;

  // PublishType filters
  @Field(() => Int, { nullable: true })
  publishType_eq?: string;

  @Field(() => Int, { nullable: true })
  publishType_neq?: string;

  @Field(() => Int, { nullable: true })
  publishType_like?: string;

  // IsPublished filters
  @Field(() => Boolean, { nullable: true })
  isPublished_eq?: string;

  @Field(() => Boolean, { nullable: true })
  isPublished_neq?: string;

  // defaultModuleID filters
  @Field(() => ID, { nullable: true})
  defaultModuleID_eq?: string;

  @Field(() => ID, { nullable: true })
  defaultModuleID_neq?: string;

  // DefaultThemeID filters
  @Field(() => ID, { nullable: true})
  defaultThemeID_eq?: string;

  @Field(() => ID, { nullable: true })
  defaultThemeID_neq?: string;
}