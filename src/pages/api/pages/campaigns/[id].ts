import { NextApiRequest, NextApiResponse } from "next";
import { CampaignLogic, HTTPHandler, TableLogic, authenticateUser, UserProfileModel, UserProfileLogic } from "server";
import {  } from "server";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaign(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  // console.log("test")
  const user = await authenticateUser(this);
  if (!user || user._id === undefined) { return; }

  const campaign = await CampaignLogic.fetchCampaign(req.query.id as string, user._id);
  if (!campaign) { this.returnError(404, "The campaign does not exist");  return; }
  const table = await TableLogic.fetchTable(campaign.table as string, user._id);
  if (!table) { this.returnError(404, "The table does not exist"); return; }
  const players = await UserProfileLogic.fetchList(campaign.players as string[]);

  this.returnSuccess({ campaign: campaign, players: players, table: table });
  // this.returnSuccess({ campaign: "campaign", table: "table" });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function campaignEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getCampaign;
  await handler.handle();
}
