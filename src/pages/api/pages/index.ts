import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser, HTTPHandler, UserProfileLogic } from "server";
import { CampaignLogic } from "server/logic/campaign";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getHome(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  const user = await authenticateUser(this);
  if (!user || user._id === undefined) { return; }
  const me = await UserProfileLogic.fetchProfile(user._id);
  const campaigns = await CampaignLogic.listCampaigns(user._id);

  this.returnSuccess({ campaigns: campaigns, me });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getHome;
  await handler.handle();
}
