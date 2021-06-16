import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { CampaignLogic, UserLogic } from "server/logic";
import { UserDocument } from "types/documents";
import { createEndpoint } from "server/utilities";
import { getMyUser } from "server/auth";
import { DocumentReference } from "server/logic/CoreModelLogic";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCampaignPage(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  const campaign = await CampaignLogic.fetchCampaign({ id: req.query.id as string, collection: "campaigns"}, myUser);
  if (!campaign) { this.returnError(404, "The given campaign was not found."); return; }
  if (campaign.players) {
    campaign.players = await UserLogic.fetchUsersFromList(campaign.players as DocumentReference[], myUser);
  }
  this.returnSuccess({ campaign });
}

export default createEndpoint({GET: getCampaignPage});
