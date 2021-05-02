import { NextApiRequest } from "next";
import { CampaignLogic, HTTPHandler, createEndpoint } from "server";
import { PlayLogic } from "server/logic/play";
import { authenticate } from "utilities/auth";

async function getPlay(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }
  const campaign = await CampaignLogic.fetchCampaign(session.user.ref.id, req.query.id as string);
  if (!campaign) {
    throw { code: 404, message: `The campaign wasn't found or you do not have access`};
  }
  // const userProfile = await UserProfileLogic.fetchProfile(session.user.ref.id);
  const messages = await PlayLogic.fetchMessages(campaign.ref?.id as string);
  console.log(messages);

  this.returnSuccess({ campaign, messages });
}

async function patchGameState(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }
  PlayLogic.handleFlush(session.user.ref.id, req.query.id as string,
    new Date(req.body.dispatchTime), req.body.dispatchHistory);
  this.returnSuccess({});
}

export default createEndpoint({GET: getPlay, PATCH: patchGameState });
