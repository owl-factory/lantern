import "reflect-metadata";
import { NextApiRequest } from "next";
import { ContentLogic } from "server/logic/ContentLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContents(this: HTTPHandler, req: NextApiRequest) {
  const contents = await fetchMany(ContentLogic.fetch, req.body.refs);
  this.returnSuccess({ contents });
}


/**
 * Creates a content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function createContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("createContent");
  const contents = await createMany(ContentLogic.create, req.body.docs);
  this.returnSuccess({ docs: contents });
}

/**
 * Updates content types
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function updateContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("updateContent");
  const contents = await updateMany(ContentLogic.update, req.body.docs);
  this.returnSuccess({ docs: contents });
}

/**
 * Deletes a content
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteContents(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("deleteContent");
  const contentTypes = await deleteMany(ContentLogic.delete, req.body.refs);
  this.returnSuccess({ docs: contentTypes });
}

export default createEndpoint({
  POST: getContents,
  PUT: createContents,
  PATCH: updateContents,
  DELETE: deleteContents,
});
