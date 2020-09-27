import { InputType, Field } from "type-graphql";
import { ContentType } from "../documents/ContentType";
import { CommonContentTypeInput } from "./CommonContentTypeInput";

@InputType()
export class ContentTypeInput extends CommonContentTypeInput implements Partial<ContentType> {
  @Field({ nullable: true })
  description?: string;
}