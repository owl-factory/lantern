import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

/**
 * A model for describing a campaign
 */
@ObjectType()
export class Campaign extends CoreDocument {
  @Field(() => ID)
  @prop({ required: true })
  gameSystemID?: string;
}

export const CampaignModel = getModelForClass(Campaign);
