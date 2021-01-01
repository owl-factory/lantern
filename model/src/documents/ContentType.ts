import { Field, ID, ObjectType } from "type-graphql";
import { CommonContentType } from "./CommonContentType";
import { getModelForClass, prop } from "@typegoose/typegoose";
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


/**
 * Describes a type of content within a game system
 */
@ObjectType()
export class ContentType extends CommonContentType {
  // The id of the game system that this content type belongs to
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  // The id of the common content type that this content type inherits
  @Field(() => ID, { nullable: true })
  @prop()
  commonContentTypeID?: string;

}

export const ContentTypeModel = getModelForClass(ContentType);
