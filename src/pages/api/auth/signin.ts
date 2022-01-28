import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { UserLogic } from "server/logic/UserLogic";


/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function signIn(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.signIn(req.body.username, req.body.password);
  this.returnSuccess({ user });
}

export default createEndpoint({POST: signIn});
