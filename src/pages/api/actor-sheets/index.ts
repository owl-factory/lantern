import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";
import { ActorSheetLogic } from "server/logic/ActorSheetLogic";
import { requireLogin } from "utilities/validation/account";

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetsRequest(this: HTTPHandler, req: NextApiRequest) {
  const actorSheets = await fetchMany(ActorSheetLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: actorSheets });
}

/**
 * Creates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actorSheets = await createMany(ActorSheetLogic.create, req.body.docs);
  this.returnSuccess({ docs: actorSheets });
}

/**
 * Updates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actorSheets = await updateMany(ActorSheetLogic.update, req.body.docs);
  this.returnSuccess({ docs: actorSheets });
}

/**
 * Deletes one or more actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  const actorSheets = await deleteMany(ActorSheetLogic.delete, req.body.refs);
  this.returnSuccess({ docs: actorSheets });
}


export default createEndpoint({
  POST: getActorSheetsRequest,
  PUT: createActorSheets,
  PATCH: updateActorSheets,
  DELETE: deleteActorSheets,
});
