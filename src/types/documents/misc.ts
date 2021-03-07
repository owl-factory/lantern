// TODO - rename and reorganize once we figure out where to put things

import { prop } from "@typegoose/typegoose";
import { FieldTypeEnum } from "..";

/**
 * An option used in a dropdown
 */
export class FieldOption {
  @prop({ required: true })
  key?: string;

  @prop({ required: true })
  value?: string;
}

/**
 * A type representing the fields that may be used to describe a type of content
 * For example, this might describe the damage done by a weapon attack (eg)
 */
export class FieldType {
  @prop({ required: true })
  name?: string;

  @prop({ required: true })
  type?: FieldTypeEnum;

  @prop()
  default?: string;
  // Any options used for dropdowns.

  @prop()
  options?: FieldOption[];

  @prop()
  readonly?: boolean; // A flag indicating whether or not this field
  // can continue to be written to
}
