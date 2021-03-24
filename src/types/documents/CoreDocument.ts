/* eslint-disable @typescript-eslint/no-var-requires */
import { prop } from "@typegoose/typegoose";

let ObjectType: any;
let Field: any;
if (typeof(window) === "undefined") {
  const test = require("type-graphql");
  ObjectType = test.ObjectType;
  Field = test.Field;
} else {
  const test = require("node_modules/type-graphql/dist/browser-shim.js");
  ObjectType = test.ObjectType;
  Field = test.Field;
}

@ObjectType()
export class CoreDocument {
  // The ID of the document
  // @Field(() => ID)
  _id!: string;

  // The name of the document
  @Field({ nullable: true })
  @prop()
  name?: string;

  // An alias (potential pulled from the name) that can be used in the URL for reference and access
  // @Field({ nullable: true })
  @prop()
  alias?: string;

  // Present only if we set an owner. Will be present for most documents
  // @Field({ nullable: true })
  @prop()
  ownedBy?: string;

  // The id of the user who created this document
  // @Field({ nullable: true })
  @prop({ required: true })
  createdBy?: string;

  // The date time that this document was created
  // @Field({ nullable: true })
  @prop({ required: true })
  createdAt?: Date = new Date();

  // The id of the user who last updated this document (set on create)
  // @Field({ nullable: true })
  @prop()
  updatedBy?: string;

  // The date time that this document was last updated (also set on create)
  // @Field({ nullable: true })
  @prop()
  updatedAt?: Date;

  // May or may not be used in the event of soft-deletion
  // TODO - Requires discussion
  // @Field({ nullable: true })
  @prop()
  deletedBy?: string;

  // @Field({ nullable: true })
  @prop()
  deletedAt?: Date;
}
