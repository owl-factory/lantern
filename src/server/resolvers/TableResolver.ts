import { CampaignResolver, TableModel } from "server";
import { getUser } from "server/utilities";
import {
  Context,
  CreateOneResponse,
  RulesetDoc,
} from "../../types";
import { CoreResolver } from "./CoreResolver";

/**
 * The resolver for CRUD operations on the Ruleset model.
 */
export class TableResolver extends CoreResolver {
  public static model = TableModel;


  /**
   * Creates a single new document and inserts it into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  public static async createOne(
    input: Record<string, unknown>,
    ctx: Context
  ): Promise<CreateOneResponse<RulesetDoc>>
   {
    let tableID = "";
    let campaignID = "";

    const user = await getUser(ctx);
    if (!user) { throw "You must be logged in to do this."; }

    const userID = user._id;

    try {
      // Create table
      const table = await super.createOne({
        ...input,
        players: [userID],
      }, ctx);
      tableID = table._id;

      const campaign = await CampaignResolver.createOne({
        ...input,
        table: table,
        players: [userID],
      }, ctx);
      campaignID = campaign._id;

      await super.updateOne(tableID, {activeCampaign: campaignID, campaigns: [campaignID]})

    //   // Create default module
    //   const module = await ModuleResolver.createOne({
    //     name: "Core Rules",
    //     rulesetID: rulesetID,
    //   }, ctx);
    //   moduleID = module._id as string;

    //   // Set ruleset's default module
    //   await super.updateOne(rulesetID, { defaultModuleID: moduleID }, ctx);

    return table;

    } catch( e ) {
      if (tableID.length === 24) { await super.deleteOne(tableID); }
      if (campaignID.length === 24) { await CampaignResolver.deleteOne(campaignID); }
      console.log(e)
      throw e;
    }
  }
}
