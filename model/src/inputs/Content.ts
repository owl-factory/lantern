import { Field, InputType } from "type-graphql";
import { Content } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may both add or update in the content document
 */
@InputType()
class ContentInput extends CoreInput implements Partial<Content> {
  @Field({ nullable: true })
  contentTypeID?: string;
}

/**
 * Describes the fields that the user may set only when creating the content document
 */
@InputType()
export class CreateContentInput extends ContentInput implements Partial<Content> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateContentInput extends ContentInput implements Partial<Content>{}
