import { NextApiRequest } from "next";
import { authenticateUser, CampaignLogic, createEndpoint, HTTPHandler, TableLogic, UserProfileLogic } from "server";

async function getPlay(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const campaign = CampaignLogic.fetchCampaign(user._id, req.query.id as string);
  if (!campaign) {
    throw { code: 404, message: `The campaign wasn't found or you do not have access`};
  }
  const userProfile = UserProfileLogic.fetchProfile(user._id);

  this.returnSuccess({ campaign, userProfile });
}

export default createEndpoint({GET: getPlay});
