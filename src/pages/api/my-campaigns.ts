import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { AnyDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";

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
  const campaigns = await CampaignLogic.findMany(ids);
  this.returnSuccess({ campaigns: campaigns });
}

export default createEndpoint({GET: getMyCampaigns});
