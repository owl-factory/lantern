import { CampaignModel } from "server";
import { CoreResolver } from "./CoreResolver";

/**
 * The resolver for CRUD operations on the Ruleset model.
 */
export class CampaignResolver extends CoreResolver {
  public static model = CampaignModel;

}
