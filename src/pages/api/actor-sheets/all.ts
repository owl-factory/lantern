import "reflect-metadata";
import { NextApiRequest } from "next";

import { createEndpoint } from "@owl-factory/https/backend";
import { ActorSheetLogic } from "server/logic/ActorSheetLogic";
import { HTTPHandler } from "@owl-factory/https/backend";

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
