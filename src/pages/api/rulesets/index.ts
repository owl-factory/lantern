import { NextApiRequest, NextApiResponse } from "next";
import { RulesetResolver } from "../../../server/resolvers/RulesetResolver";
import HTTPHandler from "../../../server/response/Response";
import { URL } from "url";

/**
 * Fetches a subset of all matching rulesets and the total count of rulesets matching the filters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesets(this: HTTPHandler, req: NextApiRequest) {
  console.log(req.query)
  // const testURL = new URL(req.url as string);
  // console.log(testURL.searchParams)
  const rulesets = await RulesetResolver.findMany();
  const rulesetCount = await RulesetResolver.findCount(req.body.filter);
  this.returnSuccess({
    rulesets: rulesets,
    rulesetCount: rulesetCount,
  });
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createRuleset(this: HTTPHandler, req: NextApiRequest) {
  const ruleset = await RulesetResolver.createOne(req.body);
  this.returnSuccess({ ruleset });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getRulesets;
  handler.POST = createRuleset;
  await handler.handle();
}
