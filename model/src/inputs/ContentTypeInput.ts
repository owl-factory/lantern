import { InputType, Field, ID } from "type-graphql";
import { ContentType, ContentTypeField, ContentTypeOption } from "../documents/ContentType";
import { CommonContentTypeInput } from "./CommonContentTypeInput";
import { LayoutItem } from "../models/LayoutItem";


@InputType() 
export class LayoutItemInput implements Partial<LayoutItem> {
  @Field()
  name: string;

  @Field()
  componentKey: string;

  // Not sure what this does. Plan this out again?
  @Field(() => [String])
  variables: string[];
  
  @Field(() => [String])
  stylingTags: string[];
}

@InputType()
export class ContentTypeOptionInput implements Partial<ContentTypeOption>  {
  @Field()
  key: string; 

  @Field()
  value: string;
}

@InputType() 
export class ContentTypeFieldInput implements Partial<ContentTypeField>  {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  default: string;

  @Field(() => [ContentTypeOptionInput], { nullable: true })
  options?: ContentTypeOptionInput[];

  @Field(() => Boolean, { nullable: true })
  readonly?: boolean;
}


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
  @Field(() => [ContentTypeFieldInput], { nullable: true })
  fields?: ContentTypeFieldInput[]; 

  @Field(() => [LayoutItemInput], { nullable: true })
  gameLayout?: LayoutItemInput[];

  @Field(() => [LayoutItemInput], { nullable: true })
  pageLayout?: LayoutItemInput[];

  @Field(() => [LayoutItemInput], { nullable: true })
  searchLayout?: LayoutItemInput[];
}