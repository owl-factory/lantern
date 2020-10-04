import { Module } from "../documents/Module";
import { InputType, Field } from "type-graphql";
import { CoreInput } from "./CoreInput";

@InputType()
export class ModuleInput extends CoreInput implements Partial<Module>  {
  @Field({ nullable: true })
  gameSystemID?: string;
}