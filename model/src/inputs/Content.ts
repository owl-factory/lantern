import { InputType, Field } from "type-graphql";
import { Content } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the content document
 */
@InputType()
export class ContentInput extends CoreInput implements Partial<Content> {
  @Field({ nullable: true })
  gameSystemID?: string;

  @Field({ nullable: true })
  contentTypeID?: string;
}