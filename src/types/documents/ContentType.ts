import { CommonContentType } from "./CommonContentType";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { ContentFieldTypeEnum } from "../enums/contentFieldType";
import { Atom, Molecule } from "../layouts";

/**
 * An option used in a dropdown
 */
export class ContentTypeOption {
  @prop({ required: true })
  key?: string;

  @prop({ required: true })
  value?: string;
}

/**
 * A type representing the fields that may be used to describe a type of content
 * For example, this might describe the damage done by a weapon attack (eg)
 */
export class ContentTypeField {
  @prop({ required: true })
  name?: string;

  @prop({ required: true })
  type?: ContentFieldTypeEnum;

  @prop()
  default?: string;
  // Any options used for dropdowns.

  @prop()
  options?: ContentTypeOption[];

  @prop()
  readonly?: boolean; // A flag indicating whether or not this field can continue to be written to

}

// A collection of possible read-only warning types generated on save.
export class ContentTypeWarnings {
  // Warns that fields exist within the ContentType layouts that do not exist
  // Such as if levels was created, a level search was added, and then the levels was removed
  @prop()
  fieldMismatchWarning?: string;

}


/**
 * Describes a type of content within a game system
 */
export class ContentTypeDoc extends CommonContentType {
  @prop({ required: true })
  rulesetID!: string;

  @prop({default: {}})
  fields?: Record<string, ContentTypeField>;

  layout?: {
    header: ( Atom | Molecule )[],
    body: ( Atom | Molecule )[],
  }

}

export const ContentTypeModel = getModelForClass(ContentTypeDoc);
