import { InputType, Field } from "type-graphql";
import { Module } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the module document
 */
@InputType()
export class ModuleInput extends CoreInput implements Partial<Module> {
  @Field({ nullable: true })
  gameSystemID?: string;
}