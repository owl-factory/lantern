import { InputType, Field } from "type-graphql";
import { Module } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the module document
 */
@InputType()
class ModuleInput extends CoreInput implements Partial<Module> {
}

/**
 * Describes the fields that the user may set only when creating the module document
 */
@InputType()
export class CreateModuleInput extends ModuleInput implements Partial<Module> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

export class UpdateModuleInput extends ModuleInput implements Partial<Module>{};