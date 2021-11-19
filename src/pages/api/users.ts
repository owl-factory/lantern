import { NextApiRequest } from "next";
import { UserLogic } from "server/logic/UserLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getUsers(this: HTTPHandler, req: NextApiRequest) {
  console.log(req.body.refs)
  const users = await UserLogic.findManyByIDs(req.body.refs);
  this.returnSuccess({ docs: users });
}

/**
 * Updates a single user
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function updateUser(this: HTTPHandler, req: NextApiRequest) {
  console.log(req.body)
  const updatedUser = await UserLogic.updateOne(req.body.ref, req.body.doc);
  this.returnSuccess({ doc: updatedUser });
}

export default createEndpoint({
  POST: getUsers,
  PATCH: updateUser,
});
