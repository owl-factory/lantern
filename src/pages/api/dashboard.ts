import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "server";
import { CampaignLogic } from "server/logic";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getDashboardPage(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const campaigns = await CampaignLogic.fetchMyCampaigns(userID);
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getDashboardPage});
