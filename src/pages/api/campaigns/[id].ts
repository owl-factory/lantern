import { NextApiRequest } from "next";
import { createEndpoint, HTTPHandler } from "server";
import { CampaignLogic } from "server/logic";
import { getSession } from "utilities/auth";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const session = getSession({req});
  console.log(req)
  const campaign = CampaignLogic.fetchCampaignByID(req.query.id as string, session.user.id);
  this.returnSuccess({ campaign });
}

export default createEndpoint({GET: getCampaignPage});
