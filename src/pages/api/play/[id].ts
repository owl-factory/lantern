import { NextApiRequest } from "next";
import { CampaignLogic, HTTPHandler, UserProfileLogic, authenticateUser, createEndpoint } from "server";
import { PlayLogic } from "server/logic/play";

async function getPlay(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const campaign = await CampaignLogic.fetchCampaign(user._id, req.query.id as string);
  if (!campaign) {
    throw { code: 404, message: `The campaign wasn't found or you do not have access`};
  }
  const userProfile = await UserProfileLogic.fetchProfile(user._id);
  const messages = await PlayLogic.fetchMessages(campaign._id as string);

  this.returnSuccess({ campaign, messages, userProfile });
}

async function patchGameState(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  PlayLogic.handleFlush(user._id, req.query.id as string, req.body.dispatchHistory);
  this.returnSuccess({});
}

export default createEndpoint({GET: getPlay, PATCH: patchGameState });
