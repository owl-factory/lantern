import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { getUniques } from "@owl-factory/utilities/arrays";

/**
 * Gets a list of a user's characters
 */
export async function getMyCharacters(_req: NextApiRequest) {
  return { characters: [], campaigns: [] };
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCharactersRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getMyCharacters(req));
}

export default createEndpoint({GET: getMyCharactersRequest});

