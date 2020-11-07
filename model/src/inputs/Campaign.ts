import { InputType, Field } from "type-graphql";
import { Campaign } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the campaign document
 */
@InputType()
export class CampaignInput extends CoreInput implements Partial<Campaign> {
  @Field({ nullable: true })
  gameSystemID?: string;
}