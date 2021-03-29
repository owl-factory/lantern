import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser, UserProfileLogic } from "server";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function saveProfile(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const profile = await UserProfileLogic.saveUserProfile(user._id, req.body);
  console.log(profile)
  this.returnSuccess({ profile });
}

export default createEndpoint({PATCH: saveProfile});
