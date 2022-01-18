import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { getUniques } from "@owl-factory/utilities/arrays";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findOne(req.query.ref as string);
  campaign.players = await UserLogic.findManyByIDs(getUniques(campaign.players, "id"));

  this.returnSuccess({ campaign: campaign });
}

export default createEndpoint({GET: getCampaignPage});
