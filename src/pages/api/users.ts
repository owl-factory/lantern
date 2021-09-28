import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { UserLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches the given rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getUsers(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);

  const users = await UserLogic.fetchMany(req.body.ids, myUser);
  this.returnSuccess({ docs: users });
}


async function updateUser(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  const updatedUser = await UserLogic.update(req.body.id, req.body.doc, myUser);
  this.returnSuccess({ doc: updatedUser });
}

export default createEndpoint({
  POST: getUsers,
  PATCH: updateUser,
});
