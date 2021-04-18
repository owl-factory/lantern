import { Ref, post, prop} from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "src/utilities";
import { UserProfileDoc } from "types";

// TODO - move this to a different file and make it, you know, work
export function getUserID(): string {
  return "1";
}

@ObjectType()
// @post<CoreDocument>(`init`, function (doc) {
//   doc.ownedBy = getUserID();
//   doc.createdAt = new Date();
//   doc.createdBy = getUserID();
// })
@post<CoreDocument>(`save`, function (doc) {
  doc.updatedAt = new Date();
  doc.createdBy = getUserID();
})
export class CoreDocument {
  _doc?: unknown;
  
  // The ID of the document
  @Field(() => ID)
  ref?: object | string;

  // The name of the document
  @Field({ nullable: true })
  @prop({ maxlength: 255 })
  name?: string;

  // An alias (potential pulled from the name) that can be used in the URL for reference and access
  @Field({ nullable: true })
  @prop({ maxlength: 20 })
  alias?: string;

  // Present only if we set an owner. Will be present for most documents
  @Field(() => UserProfileDoc, { nullable: true })
  @prop({ ref: `userprofiles`})
  ownedBy?: Ref<UserProfileDoc>;

  // The id of the user who created this document
  @Field({ nullable: true })
  @prop({ required: false })
  createdBy?: string;

  // The date time that this document was created
  @Field({ default: new Date() })
  @prop()
  createdAt?: Date;

  // The id of the user who last updated this document (set on create)
  @Field({ nullable: true })
  @prop()
  updatedBy?: string;

  // The date time that this document was last updated (also set on create)
  @Field({ default: new Date() })
  @prop()
  updatedAt?: Date;

  // May or may not be used in the event of soft-deletion
  // TODO - Requires discussion
  @Field({ nullable: true })
  @prop()
  deletedBy?: string;

  @Field({ nullable: true })
  @prop()
  deletedAt?: Date;
}
