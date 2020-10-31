import { Module } from "../documents/Module";
import { InputType, Field, Int } from "type-graphql";
import { CoreInput } from "./CoreInput";

/**
 * The model for describing inputs for creating or editing a module
 */
@InputType()
export class ModuleInput extends CoreInput implements Partial<Module>  {
  @Field({ nullable: true })
  gameSystemID?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  publishType?: number;

  @Field(() => Boolean, { nullable: true })
  isPublished?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPurchasable?: boolean;

  @Field(() => Int, { nullable: true })
  cost?: number;
}