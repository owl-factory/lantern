import { CommonContentType } from "./CommonContentType";
import { prop } from "@typegoose/typegoose";
import { FieldTypeEnum } from "../enums/fieldType";
import { Atom, Molecule } from "../layouts";
import { FieldType } from "./misc";

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

  @prop({default: { name: {name: "Name", key: "name", type: FieldTypeEnum.Text}}})
  fields?: Record<string, FieldType>;

  layout?: {
    header: ( Atom | Molecule )[],
    body: ( Atom | Molecule )[],
  }

}

