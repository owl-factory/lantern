import { InputType, Field } from "type-graphql";
import { ContentType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the content type document
 */
@InputType()
class ContentTypeInput extends CoreInput implements Partial<ContentType> {
  @Field({ nullable: true })
  commonContentTypeID?: string;
}

/**
 * Describes the fields that the user may set only when creating the Content Type document
 */
@InputType()
export class CreateContentTypeInput extends ContentTypeInput implements Partial<ContentType> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateContentTypeInput extends ContentTypeInput implements Partial<ContentType>{};