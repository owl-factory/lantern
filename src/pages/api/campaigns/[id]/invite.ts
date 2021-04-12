import { NextApiRequest } from "next";
import { authenticateUser, CampaignLogic, createEndpoint, HTTPHandler, TableLogic } from "server";

async function toggleLinkInvite(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  await CampaignLogic.toggleInviteLink(user._id, req.query.id as string);
  this.returnSuccess({});
}

async function attemptJoin(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const res = await CampaignLogic.attemptJoinByLink(user._id, req.query.id as string, req.body.inviteKey);
  if (!res.campaign) { return; }
  if (res.campaign.table) {
    await TableLogic.addUserToTable(user._id, res.campaign.table.toString());
  }
  this.returnSuccess(res);
}

export default createEndpoint({ POST: toggleLinkInvite, PATCH: attemptJoin });
