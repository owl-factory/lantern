import { ObjectType, Field } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

@ObjectType({ description: "A testing model for characters. This is solely for testing purposes"})
export class Module extends CoreDocument {
  
  @Field()
  @Filter(idFilters)
  @prop({ required: true })
  gameSystemID: string;

  @Field()
  @Filter(stringFilters)
  @prop({ default: ""})
  description?: string = "";

  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPublished: boolean;

  // Possibly to be removed
  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPurchasable: boolean;
}

export const ModuleModel = getModelForClass(Module);
export const ModuleFilter = generateFilterType(Module);
