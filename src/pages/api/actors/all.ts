import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { ActorLogic } from "server/logic/ActorLogic";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorList(this: HTTPHandler, req: NextApiRequest) {
  const actors = await ActorLogic.searchAllActors();
  this.returnSuccess({ docs: actors });
}

export default createEndpoint({POST: getActorList});
