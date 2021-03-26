import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver, HTTPHandler, RulesetResolver, UserProfileResolver } from "../../../../server";
import { authenticateUser } from "../../../../server/utilities/auth";
import { RulesetDoc, UserProfileDoc } from "../../../../types";

async function getRulesets(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  console.log("HI!")
  // const data: Record<string, RulesetDoc[]> = { myRulesets: [], rulesets: [] };
  // const user = authenticateUser(this);
  // TODO - add publishSource / type (official, etc) filter
  const rulesets = await RulesetResolver.findMany();
  const rulesetCount = await RulesetResolver.findCount();
  this.returnSuccess({
    myRulesets: [],
    initialRulesets: rulesets,
    rulesetCount: rulesetCount,
  });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getRulesets;
  await handler.handle();
}
