// TODO - rename and reorganize once we figure out where to put things
import { FieldTypeEnum } from "..";

/**
 * An option used in a dropdown
 */
export class FieldOption {
  key?: string;

  value?: string;
}

/**
 * A type representing the fields that may be used to describe a type of content
 * For example, this might describe the damage done by a weapon attack (eg)
 */
export class FieldType {
  name?: string;

  type?: FieldTypeEnum;

  default?: string;
  // Any options used for dropdowns.

  options?: FieldOption[];

  readonly?: boolean; // A flag indicating whether or not this field
  // can continue to be written to
}
