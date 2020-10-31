import { CoreDocument } from "./CoreDocument"
import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID, Int } from "type-graphql";
import GraphQLJSON from 'graphql-type-json';

/**
 * A model describing the Content document, which contains the static information
 * about items within a game system--for example, the spell 'Fireball'.
 */
@ObjectType()
export class Content extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID: string;

  // The originating content that this is copied from
  @Field(() => ID, { nullable: true })
  @prop()
  sourceContentID?: string; 

  @Field(() => ID)
  @prop({ required: true })
  contentTypeID: string;

  @Field(() => [ID], { defaultValue: [] })
  @prop({ default: [] })
  moduleIDs: string[];

  @Field(() => Int)
  @prop({ required: true })
  publishType?: number;

  @Field(() => Boolean)
  @prop()
  isPurchasable: boolean;

  @Field(() => GraphQLJSON)
  @prop({ default: {}})
  data: any;
}

export const ContentModel = getModelForClass(Content);
