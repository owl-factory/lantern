import { InputType, Field } from "type-graphql";
import { CoreInput } from "./CoreInput";
import { CommonContentType } from "../documents/CommonContentType";

@InputType()
export class CommonContentTypeInput extends CoreInput implements Partial<CommonContentType> {
  @Field({ nullable: true })
  description?: string;
}