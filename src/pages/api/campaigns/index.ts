import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "nodes/https/backend";
// import { init, version } from "fauna/migrations/campaigns";

/**
 * Creates the given campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function create(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Fetches the requested campaigns by ref
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function read(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Updates the requested campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function update(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Fetches the requested campaigns by ref
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function remove(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: read, PUT: create, PATCH: update, DELETE: remove,
});
