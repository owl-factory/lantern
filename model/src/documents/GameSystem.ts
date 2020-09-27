import { ObjectType, Field, Int } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters, booleanFilters, idFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

@ObjectType({ description: "The unifying document for all Game System document types"})
export class GameSystem extends CoreDocument {
  // Overrides the original name to require uniqueness
  @prop({ unique: true })
  name?: string;

  @prop({ unique: true })
  alias?: string;

  @Field({ nullable: true })
  @Filter(stringFilters)
  @prop({ default: "" })
  description?: string;

  @Field(() => Int)
  @prop({ required: true })
  publishType?: number;

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
