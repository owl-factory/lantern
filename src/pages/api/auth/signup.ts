import "reflect-metadata";
import { NextApiRequest } from "next";
import { normalize } from "@owl-factory/utilities/strings";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { UserLogic } from "server/logic/UserLogic";


/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function signUp(this: HTTPHandler, req: NextApiRequest) {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    this.returnError(401, "Account creation is disabled at this time.");
    return;
  }

  req.body.username = normalize(req.body.username);
  req.body.email = normalize(req.body.email);
  const user = await UserLogic.signUp(req.body, req.body.password);
  this.returnSuccess({ user });
}

export default createEndpoint({POST: signUp});
