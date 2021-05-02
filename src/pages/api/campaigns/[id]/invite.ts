import { NextApiRequest } from "next";
import { CampaignLogic, HTTPHandler, TableLogic, createEndpoint } from "server";
import { authenticate } from "utilities/auth";

async function toggleLinkInvite(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id ) { return; }
  await CampaignLogic.toggleInviteLink(session.user.ref.id, req.query.id as string);
  this.returnSuccess({});
}

async function attemptJoin(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id ) { return; }
  const res = await CampaignLogic.attemptJoinByLink(session.user.ref.id, req.query.id as string, req.body.inviteKey);
  if (!res.campaign) { return; }
  if (res.campaign.table) {
    await TableLogic.addUserToTable(session.user.ref.id, res.campaign.table.toString());
  }
  this.returnSuccess(res);
}

export default createEndpoint({ POST: toggleLinkInvite, PATCH: attemptJoin });
