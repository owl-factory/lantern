import { ObjectType, Field, ID } from "type-graphql";
import { CommonContentType } from "./CommonContentType";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { LayoutItem } from "../models/LayoutItem";
import { ContentFieldTypeEnum } from "../enums/contentFieldType";

/**
 * An option used in a dropdown
 */
@ObjectType()
export class ContentTypeOption {
  @Field()
  @prop({ required: true })
  key: string; 

  @Field()
  @prop({ required: true })
  value: string;
}

/**
 * A type representing the fields that may be used to describe a type of content
 * For example, this might describe the damage done by a weapon attack (eg)
 */
@ObjectType()
export class ContentTypeField {
  @Field({ nullable: true })
  @prop({ required: true })
  name: string;

  @Field()
  @prop({ required: true })
  type: ContentFieldTypeEnum;

  @Field({ nullable: true })
  @prop()
  default: string;
  // Any options used for dropdowns. 

  @Field(() => [ContentTypeOption], { nullable: true })
  @prop()
  options?: ContentTypeOption[];

  @Field(() => Boolean, { nullable: true })
  @prop()
  readonly?: boolean; // A flag indicating whether or not this field can continue to be written to

}

// A collection of possible read-only warning types generated on save. 
@ObjectType()
export class ContentTypeWarnings {
  // Warns that fields exist within the ContentType layouts that do not exist
  // Such as if levels was created, a level search was added, and then the levels was removed 
  @Field({ nullable: true })
  @prop()
  fieldMismatchWarning?: string; 

}


@ObjectType()
export class ContentType extends CommonContentType {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  @Field(() => ID, { nullable: true })
  @prop()
  commonContentTypeID?: string;

  // If true, we do NOT return this while searching. This indicates that this type is used for
  // entity sheets and nothing else. 
  @Field(() => Boolean)
  @prop()
  isTypeOnly: boolean;

  @Field(() => [ContentTypeField])
  @prop({ type: ContentTypeField, _id: false})
  fields: ContentTypeField[];

  // The layout of the content within the game
  // The common spell card sort of layout
  @Field(_type => [LayoutItem])
  @prop({ default: [] })
  gameLayout: LayoutItem[];

  // The layout of the item within the webapp. This is perhaps a more clean version
  // May be absorbed with game layout into a single layout. 
  @Field(_type => [LayoutItem])
  @prop({ default: [] })
  pageLayout: LayoutItem[];

  // The layout of the item within 
  @Field(_type => [LayoutItem])
  @prop({ default: [] })
  searchLayout: LayoutItem[];

  @Field(() => ContentTypeWarnings, { nullable: true })
  @prop()
  warnings?: ContentTypeWarnings;
}

export const ContentTypeModel = getModelForClass(ContentType);
