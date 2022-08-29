import "reflect-metadata";
import { NextApiRequest } from "next";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { fetchMany, updateMany } from "server/logic/many";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getUsers(this: HTTPHandler, req: NextApiRequest) {
  const users = await fetchMany(UserLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: users });
}

/**
 * Updates a single user
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function updateUser(this: HTTPHandler, req: NextApiRequest) {
  const users = await updateMany(UserLogic.update, req.body.docs);
  this.returnSuccess({ docs: users });
}

export default createEndpoint({
  POST: getUsers,
  PATCH: updateUser,
});
