import { NextApiRequest, NextApiResponse } from "next";
import { ContentTypeResolver, RulesetResolver } from "../../../../server";
import HTTPHandler from "../../../../server/response/Response";
import { ContentTypeDoc } from "../../../../types";

/**
 * Fetches a single content type
 * @param this The handler class calling this function
 * @param req The request to update in the server
 */
async function fetchContentTypePage(this: HTTPHandler, req: NextApiRequest) {
  const contentType = await ContentTypeResolver.findOne(req.query.id as string) as ContentTypeDoc;
  if (!contentType) { this.returnError(404, "The content type was not found."); return;}

  const ruleset = await RulesetResolver.findOne(contentType.rulesetID);
  if (!ruleset) { this.returnError(404, "The ruleset was not found."); return; }

  this.returnSuccess({ contentType, ruleset });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = fetchContentTypePage;
  await handler.handle();
}
