import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { requireLogin } from "utilities/validation/account";

/**
 * Fetches the actor sheets for the given refs
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActors(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Creates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Updates actor sheets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes one or more actors
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteActors(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}


export default createEndpoint({
  POST: getActors,
  PUT: createActors,
  PATCH: updateActors,
  DELETE: deleteActors,
});
