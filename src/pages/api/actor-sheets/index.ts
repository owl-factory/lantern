import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { fetchMany } from "server/logic/many";
import { ActorSheetLogic } from "server/logic/ActorSheetLogic";

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetsRequest(this: HTTPHandler, req: NextApiRequest) {
  const actorSheets = await fetchMany(ActorSheetLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: actorSheets });
}


export default createEndpoint({
  POST: getActorSheetsRequest,
});
