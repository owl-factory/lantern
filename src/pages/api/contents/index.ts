import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContents(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ contents: [] });
}


/**
 * Creates a content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function createContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Updates content types
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function updateContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes a content
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getContents,
  PUT: createContents,
  PATCH: updateContents,
  DELETE: deleteContents,
});
