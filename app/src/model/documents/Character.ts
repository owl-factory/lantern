import { ObjectType, Field } from "type-graphql";
import { Filter, generateFilterType } from "type-graphql-filter";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { stringFilters } from "../filterTypes";
import { CoreDocument } from "./CoreDocument";

@ObjectType({ description: "A testing model for characters. This is solely for testing purposes"})
export class Character extends CoreDocument {
  @Field()
  @Filter(stringFilters)
  @prop({ required: true })
  name?: string;
}

export const CharacterModel = getModelForClass(Character);
export const CharacterFilter = generateFilterType(Character);
