import { Field, InputType } from "type-graphql";
import { Campaign } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the campaign document
 */
@InputType()
class CampaignInput extends CoreInput implements Partial<Campaign> {
}

/**
 * Describes the fields that the user may set only when creating the campaign document
 */
@InputType()
export class CreateCampaignInput extends CampaignInput implements Partial<Campaign> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

@InputType()
export class UpdateCampaignInput extends CampaignInput implements Partial<Campaign>{}
