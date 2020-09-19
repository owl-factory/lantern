import { ObjectType, Field } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

@ObjectType({ description: "The unifying document for all Game System document types"})
export class GameSystem extends CoreDocument {
  @Field({ nullable: true })
  @Filter(stringFilters)
  @prop({ default: "" })
  description?: string;

  @Field(_type => Boolean, { defaultValue: true })
  @Filter(booleanFilters)
  @prop({ default: true, required: true })
  isUserCreated?: boolean;

  @Field(_type => Boolean, { defaultValue: false })
  @Filter(booleanFilters)
  @prop({ default: false, required: true })
  isPublished?: boolean;

  // Will be created by default, need a default module idd
  @Field({ nullable: false }) // Optional to send, required to have
  @Filter(idFilters)
  @prop({ required: false })
  defaultModuleID?: string;

  @Field({ nullable: true })
  @Filter(idFilters)
  @prop()
  defaultThemeID?: string;
}

export const GameSystemModel = getModelForClass(GameSystem);
export const GameSystemFilter = generateFilterType(GameSystem);
