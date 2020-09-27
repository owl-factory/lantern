import { ObjectType, Field, Int } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

/**
 * The document model for modules within game systems
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

  // Possibly to be removed
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
export const ModuleFilter = generateFilterType(Module);
