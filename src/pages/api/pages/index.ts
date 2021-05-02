import { NextApiRequest, NextApiResponse } from "next";
import { HTTPHandler } from "server";
import { CampaignLogic } from "server/logic/campaign";
import { authenticate } from "utilities/auth";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getHome(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }
  // const me = await UserProfileLogic.fetchProfile(session.user.ref.id);
  const campaigns = await CampaignLogic.listCampaigns(session.user.ref.id);

  this.returnSuccess({ campaigns: campaigns });
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
