import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Width } from "../models/Width";
import { Content } from "./Content";
import { DynamicContent } from "./DynamicContent";

@ObjectType()
export class DynamicSubsection {
  @Field({ nullable: true })
  @prop()
  name?: string;

  @Field({ nullable: true })
  @prop()
  description?: string;

  @Field(() => Width, { nullable: true })
  @prop()
  w?: Width;

  @Field()
  @prop({ required: true })
  h: number;

  @Field(() => [DynamicContent])
  @prop({ required: true })
  contents: DynamicContent[];
}