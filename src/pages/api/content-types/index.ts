import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypes(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Creates a content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function createContentTypes(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Updates content types
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function updateContentTypes(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

/**
 * Deletes a content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteContentTypes(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getContentTypes,
  PUT: createContentTypes,
  PATCH: updateContentTypes,
  DELETE: deleteContentTypes,
});
