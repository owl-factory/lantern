import "reflect-metadata";
import { NextApiRequest } from "next";
import { ContentTypeLogic } from "server/logic/ContentTypeLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, fetchMany } from "server/logic/many";
import { requireLogin, requirePermission } from "utilities/validation/account";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getContentTypes(this: HTTPHandler, req: NextApiRequest) {
  const contentTypes = await fetchMany(ContentTypeLogic.fetch, req.body.refs);
  this.returnSuccess({ contentTypes });
}

/**
 * Creates a content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function createContentTypes(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("createContentType");
  const contentTypes = await createMany(ContentTypeLogic.create, req.body.docs);
  this.returnSuccess({ docs: contentTypes });
}

export default createEndpoint({POST: getContentTypes, PUT: createContentTypes});
