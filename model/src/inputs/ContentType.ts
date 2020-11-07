import { InputType, Field } from "type-graphql";
import { ContentType } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the content type document
 */
@InputType()
export class ContentTypeInput extends CoreInput implements Partial<ContentType> {
  @Field({ nullable: true })
  gameSystemID?: string;

  @Field({ nullable: true })
  commonContentTypeID?: string;
}