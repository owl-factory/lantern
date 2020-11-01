import { ObjectType, Field, Int } from "type-graphql";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";
import { PublishType } from "../enums/publishType";

@ObjectType({ description: "The unifying document for all Game System document types"})
export class GameSystem extends CoreDocument {
  // Overrides the original name to require uniqueness
  @prop({ unique: true })
  name?: string;

  @prop({ unique: true })
  alias?: string;

  @Field({ nullable: true })
  @prop({ default: "" })
  description?: string;

  @Field(() => Int)
  @prop({ required: true })
  publishType?: PublishType;

  @Field(_type => Boolean, { defaultValue: false })
  @prop({ default: false, required: true })
  isPublished?: boolean;

  // Will be created by default, need a default module idd
  @Field({ nullable: false }) // Optional to send, required to have
  @prop({ required: false })
  defaultModuleID?: string;

  @Field({ nullable: true })
  @prop()
  defaultThemeID?: string;
}

export const GameSystemModel = getModelForClass(GameSystem);
