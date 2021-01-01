import { Field, ID, ObjectType } from "type-graphql";
import { prop } from "@typegoose/typegoose";

export class CoreDocument {
  // The ID of the document
  _id?: string;

  // The name of the document
  @prop()
  name?: string;

  // An alias (potential pulled from the name) that can be used in the URL for reference and access
  @prop()
  alias?: string;

  // Present only if we set an owner. Will be present for most documents
  @prop()
  ownedBy?: string;

  // The id of the user who created this document
  @prop({ required: true })
  createdBy?: string;

  // The date time that this document was created
  @prop({ required: true })
  createdAt?: Date = new Date();

  // The id of the user who last updated this document (set on create)
  @prop()
  updatedBy?: string;

  // The date time that this document was last updated (also set on create)
  @prop()
  updatedAt?: Date;

  // May or may not be used in the event of soft-deletion
  // Requires discussion
  @prop()
  deletedBy?: string;

  @prop()
  deletedAt?: Date;
}
