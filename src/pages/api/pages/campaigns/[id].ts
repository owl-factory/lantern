import { NextApiRequest, NextApiResponse } from "next";
import { CampaignLogic, HTTPHandler } from "server";
import {  } from "server";
import { authenticate } from "utilities/auth";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaign(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  // console.log("test")
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }

  const campaign = await CampaignLogic.fetchCampaign(session.user.ref.id, req.query.id as string);
  if (!campaign) { this.returnError(404, "The campaign does not exist");  return; }
  // const players = await UserProfileLogic.fetchList(campaign.players as string[]);

  this.returnSuccess({ campaign: campaign });
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
