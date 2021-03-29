import { NextApiRequest } from "next";
import { authenticateUser, CampaignLogic, createEndpoint, HTTPHandler } from "server";

async function toggleLinkInvite(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  await CampaignLogic.toggleInviteLink(user._id, req.query.id as string);
  this.returnSuccess({});
}

async function attemptJoin(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const newlyJoined = await CampaignLogic.attemptJoinByLink(user._id, req.query.id as string, req.body.inviteKey);
  this.returnSuccess({ newlyJoined });
  // this.returnSuccess({})
}

export default createEndpoint({ POST: toggleLinkInvite, PATCH: attemptJoin });
