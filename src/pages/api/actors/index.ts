import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";
import { requireLogin } from "utilities/validation/account";
import { ActorLogic } from "server/logic/ActorLogic";

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActors(this: HTTPHandler, req: NextApiRequest) {
  const actors = await fetchMany(ActorLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: actors });
}

/**
 * Creates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actorSheets = await createMany(ActorLogic.create, req.body.docs);
  this.returnSuccess({ docs: actorSheets });
}

/**
 * Updates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actorSheets = await updateMany(ActorLogic.update, req.body.docs);
  this.returnSuccess({ docs: actorSheets });
}

/**
 * Deletes one or more actors
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actors = await deleteMany(ActorLogic.delete, req.body.refs);
  this.returnSuccess({ docs: actors });
}


export default createEndpoint({
  POST: getActors,
  PUT: createActors,
  PATCH: updateActors,
  DELETE: deleteActors,
});
