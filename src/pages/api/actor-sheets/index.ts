import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { requireLogin } from "utilities/validation/account";

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActorSheetsRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Creates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Updates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes one or more actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteActorSheets(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}


export default createEndpoint({
  POST: getActorSheetsRequest,
  PUT: createActorSheets,
  PATCH: updateActorSheets,
  DELETE: deleteActorSheets,
});
