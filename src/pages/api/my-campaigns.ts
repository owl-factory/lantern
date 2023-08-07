import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "nodes/https/backend";

/**
 * Fetches all of the current user's campaigns
 * @param _req The request to the server. Unused but required for handleAPI
 */
export async function getMyCampaigns(_req: NextApiRequest) {
  return { docs: [] };
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCampaignsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getMyCampaigns(req));
}

export default createEndpoint({POST: getMyCampaignsRequest});
