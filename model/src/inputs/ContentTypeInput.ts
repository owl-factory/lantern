import { InputType, Field, ID } from "type-graphql";
import { ContentType } from "../documents/ContentType";
import { CommonContentTypeInput } from "./CommonContentTypeInput";
import { LayoutItem } from "../models/LayoutItem";

/**
 * The model for creating a new content type
 */
@InputType()
export class ContentTypeInput extends CommonContentTypeInput implements Partial<ContentType> {
  @Field(() => ID, { nullable: true })
  gameSystemID?: string;
  
  @Field(() => ID, { nullable: true })
  commonContentTypeID?: string;

  // TODO - I think this might have to be a JSON string :/
  // That's basically fine, but we can't search for it (easily)
  @Field({ nullable: true })
  fields?: string; 

  @Field(() => [LayoutItem], { nullable: true })
  layout?: LayoutItem[];
}