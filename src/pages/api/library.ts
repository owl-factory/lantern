import "reflect-metadata";
import { NextApiRequest } from "next";
import { FileLogic } from "server/logic/FileLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Gets the information to render the current user's library page
 */
export async function getLibraryPage(_req: NextApiRequest) {
  const images = await FileLogic.searchMyImages({ size: 100 });
  return { images };
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getLibraryPageRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getLibraryPage(req));
}

export default createEndpoint({GET: getLibraryPageRequest});
