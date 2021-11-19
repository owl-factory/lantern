import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { Ref64 } from "types";
import { AnyDocument } from "types/documents";

function parseIDsFromDocuments(docs: Partial<AnyDocument>[]) {
  const ids: Ref64[] = [];
  docs.forEach((doc: Partial<AnyDocument>) => {
    if(!doc.ref) { return; }
    ids.push(doc.ref);
  });
  return ids;
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCampaigns(this: HTTPHandler, req: NextApiRequest) {
  const fetchedCampaigns = await CampaignLogic.fetchMyCampaigns({ size: 20 });
  const ids = parseIDsFromDocuments(fetchedCampaigns);
  const campaigns = await CampaignLogic.findManyByIDs(ids);
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getMyCampaigns});
