import { ObjectType, Field } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

@ObjectType({ description: "The unifying document for all Game System document types"})
export class GameSystem extends CoreDocument {
  @Field()
  @Filter(stringFilters)
  @prop({ default: "", required: true })
  description: string;

  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isUsedCreated: boolean;

  // Will be created by default, need a default module id
  @Field({ nullable: true })
  @Filter(idFilters)
  @prop()
  defaultModuleID: string;

  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPublished: boolean;

  // Possibly to be removed
  @Field(_type => Boolean)
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPurchasable: boolean;

  @Field()
  @Filter(idFilters)
  @prop({ default: false, required: true })
  defaultThemeID: string;
}

export const GameSystemModel = getModelForClass(GameSystem);
export const GameSystemFilter = generateFilterType(GameSystem);