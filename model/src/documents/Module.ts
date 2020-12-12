import { Field, ObjectType } from "type-graphql";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

/**
 * The model for the Module document. Modules tie together clumps of entities,
 * content, campaigns, etc and may be potentially purchased.
 */
@ObjectType()
export class Module extends CoreDocument {
  @Field()
  @prop({ required: true })
  gameSystemID: string;
}

export const ModuleModel = getModelForClass(Module);
