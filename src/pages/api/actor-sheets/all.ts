import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { ActorSheetLogic } from "server/logic/ActorSheetLogic";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetList(this: HTTPHandler, req: NextApiRequest) {
  const actorSheets = await ActorSheetLogic.searchAllActorSheets();
  this.returnSuccess({ docs: actorSheets });
}

export default createEndpoint({POST: getActorSheetList});
