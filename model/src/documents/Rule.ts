import { CoreDocument } from "./CoreDocument"
import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

/**
 * A model describing the Content document, which contains the static information
 * about items within a game system--for example, the spell 'Fireball'.
 */
@ObjectType()
export class Rule extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID?: string;
}

export const RuleModel = getModelForClass(Rule);
