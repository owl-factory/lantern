import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { Ref64 } from "types";
import { AnyDocument } from "types/documents";

function parseIDsFromDocuments(docs: Partial<AnyDocument>[]) {
  const ids: Ref64[] = [];
  docs.forEach((doc: Partial<AnyDocument>) => {
    if(!doc.id) { return; }
    ids.push(doc.id);
  });
  return ids;
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCampaigns(this: HTTPHandler, req: NextApiRequest) {
  console.log('hi')
  const fetchedCampaigns = await CampaignLogic.fetchMyCampaigns({ size: 20 });
  console.log(fetchedCampaigns)
  const ids = parseIDsFromDocuments(fetchedCampaigns);
  const campaigns = await CampaignLogic.findManyByIDs(ids);
  console.log(campaigns)
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getMyCampaigns});
