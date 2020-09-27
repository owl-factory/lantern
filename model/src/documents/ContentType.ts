import { ObjectType, Field, ID } from "type-graphql";
import { CommonContentType } from "./CommonContentType";
import { prop, getModelForClass } from "@typegoose/typegoose";

class ContentTypeField {

}

class LayoutItem {

}

@ObjectType()
export class ContentType extends CommonContentType {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  @Field(() => ID, { nullable: true })
  @prop()
  commonContentTypeID?: string;

  // Can we get this to work in graphql, or does this need to be converted to json?
  @Field(_type => ContentTypeField)
  @prop({ default: {} })
  fields: any;

  @Field(_type => [LayoutItem])
  @prop({ default: [] })
  layout: LayoutItem[];
}

export const CommonContentTypeModel = getModelForClass(CommonContentType);
