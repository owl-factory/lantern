import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getUsers(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

/**
 * Updates a single user
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function updateUser(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess({ docs: [] });
}

export default createEndpoint({
  POST: getUsers,
  PATCH: updateUser,
});
