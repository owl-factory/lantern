import { ObjectType, Field, Int } from "type-graphql";
import { Filter } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../models/filterTypes";
import { CoreDocument } from "./CoreDocument";

/**
 * The model for the Module document. Modules tie together clumps of entities, 
 * content, campaigns, etc and may be potentially purchased.
 */
@ObjectType()
export class Module extends CoreDocument {
  
  @Field()
  @Filter(idFilters)
  @prop({ required: true })
  gameSystemID: string;

  @Field()
  @Filter(stringFilters)
  @prop({ default: ""})
  description?: string = "";

  @Field(() => Int)
  @prop({ required: true })
  publishType?: number;

  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPublished: boolean;

  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPurchasable: boolean;

  // The cost in USD cents
  @Field(() => Int, { nullable: true })
  @prop()
  cost?: number;
}

export const ModuleModel = getModelForClass(Module);
