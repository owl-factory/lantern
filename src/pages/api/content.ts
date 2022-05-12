import "reflect-metadata";
import { NextApiRequest } from "next";
import { ContentLogic } from "server/logic/ContentLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { fetchMany } from "server/logic/many";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContents(this: HTTPHandler, req: NextApiRequest) {
  const contents = await fetchMany(ContentLogic.fetch, req.body.refs);
  this.returnSuccess({ contents });
}

export default createEndpoint({POST: getContents});
