import { InputType, Field } from "type-graphql";
import { CoreInput } from "./CoreInput";
import { CommonEntityType } from "../documents/CommonEntityType";

@InputType()
export class CommonEntityTypeInput extends CoreInput implements Partial<CommonEntityType> {
  @Field({ nullable: true })
  description?: string;
}