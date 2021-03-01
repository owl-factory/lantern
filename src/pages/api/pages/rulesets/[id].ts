import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver, HTTPHandler, RulesetResolver } from "../../../../server";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getRulesetPage(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  const ruleset = await RulesetResolver.findOne(req.query.id as string);
  const contentTypeFilters = {
    ...(req.body.contentType.filters || {}),
    rulesetID: { eq: req.query.id },
  };
  const contentTypes = await ContentTypeResolver.findMany(contentTypeFilters, req.body.contentType.options);
  const contentTypeCount = await ContentTypeResolver.findCount(contentTypeFilters);

  this.returnSuccess({
    contentTypes: contentTypes,
    contentTypeCount: contentTypeCount,
    ruleset: ruleset,
  });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.POST = getRulesetPage;
  await handler.handle();
}
