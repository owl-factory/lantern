import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "server";
import { CampaignLogic } from "server/logic";
import { UserLogic } from "server/logic/UserLogic";
import { UserDocument } from "types";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const campaign = await CampaignLogic.fetchCampaignByID(req.query.id as string, userID);
  if (!campaign) { this.returnError(404, "The given campaign was not found."); return; }
  const players = await UserLogic.findUsersByRefs(campaign.players as UserDocument[], userID);
  campaign.players = players;
  this.returnSuccess({ campaign });
}

export default createEndpoint({GET: getCampaignPage});
