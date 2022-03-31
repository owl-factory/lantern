import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";

/**
 * Creates the given campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function create(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await createMany(CampaignLogic.create, req.body.docs);
  this.returnSuccess({ docs: campaigns });
}

/**
 * Fetches the requested campaigns by ref
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function read(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await fetchMany(CampaignLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: campaigns });
}

/**
 * Updates the requested campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function update(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await updateMany(CampaignLogic.update, req.body.docs);
  this.returnSuccess({ docs: campaigns });
}

/**
 * Fetches the requested campaigns by ref
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function remove(this: HTTPHandler, req: NextApiRequest) {
  const campaigns = await deleteMany(CampaignLogic.delete, req.body.refs);
  this.returnSuccess({ docs: campaigns });
}

export default createEndpoint({
  POST: read, PUT: create, PATCH: update, DELETE: remove,
});
