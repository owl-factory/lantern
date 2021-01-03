import { CoreDocument } from "./CoreDocument";
import { getModelForClass, prop } from "@typegoose/typegoose";

/**
 * A model for describing a campaign
 */
export class Campaign extends CoreDocument {
  @prop({ required: true })
  gameSystemID?: string;
}

export const CampaignModel = getModelForClass(Campaign);
