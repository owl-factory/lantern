import { Field, ID, ObjectType } from "type-graphql";
import { Filter } from "type-graphql-filter";
import { dateFilters, idFilters, stringFilters } from "../filterTypes";
import { prop } from "@typegoose/typegoose";

@ObjectType()
export class CoreDocument {
  @Field(() => ID)
  @Filter(idFilters)
  _id: string;

  @Field({ nullable: true })
  @Filter(stringFilters)
  @prop()
  name?: string;

  @Field({ nullable: true })
  @Filter(stringFilters)
  @prop()
  alias?: string;

  // Present only if we set an owner. Will be present for most documents
  @Field({ nullable: true })
  @Filter(idFilters)
  @prop()
  ownedBy?: string;

  @Field({ nullable: true })
  @Filter(idFilters)
  @prop({ required: true })
  createdBy?: string = null;

  @Field(_type => Date, { nullable: true })
  @Filter(dateFilters)
  @prop({ required: true })
  createdAt?: Date = new Date();

  @Field({ nullable: true })
  @Filter(idFilters)
  @prop()
  updatedBy?: string;

  @Field(_type => Date, { nullable: true })
  @Filter(dateFilters)
  @prop()
  updatedAt?: Date;

  // May or may not be used in the event of soft-deletion
  @Field({ nullable: true })
  @Filter(idFilters)
  @prop()
  deletedBy?: string;

  @Field(_type => Date, { nullable: true })
  @Filter(dateFilters)
  @prop()
  deletedAt?: Date;
}