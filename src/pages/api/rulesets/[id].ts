import { NextApiRequest, NextApiResponse } from "next";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";

/**
 * Fetches all rulesets
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRuleset(this: HTTPHandler, req: NextApiRequest) {
  const rulesets = await RulesetResolver.findMany(req.body.filter, req.body.options);
  this.returnSuccess({
    rulesets: rulesets,
    rulesetCount: 1,
  });
}

async function deleteRuleset(this: HTTPHandler, req: NextApiRequest) {
  const result = await RulesetResolver.deleteOne(req.body._id);
  this.returnSuccess({ result });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getRuleset;
  handler.DELETE = deleteRuleset;
  await handler.handle();
}
