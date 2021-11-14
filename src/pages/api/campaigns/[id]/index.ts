import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { CampaignLogic, UserLogic } from "server/logic";
import { createEndpoint } from "server/utilities";
import { getMyUser } from "server/auth";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  const campaign = await CampaignLogic.findByID(req.query.id as string);
  campaign.players = await UserLogic.findManyByIDs(campaign.players);

  this.returnSuccess({ campaign: campaign });
}

export default createEndpoint({GET: getCampaignPage});
