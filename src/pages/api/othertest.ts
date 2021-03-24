import { NextApiRequest, NextApiResponse } from "next";
import { HTTPHandler } from "../../server";
import { TestResolver } from "./graphql";

/**
 * Fetches all information for rendering the individual ruleset page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function test(this: HTTPHandler, req: NextApiRequest): Promise<void> {
  const newTest = new TestResolver();
  this.returnSuccess({ data: newTest.test() });
}

/**
 * Handles the results endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function rulesetsEndpoint(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = test;
  await handler.handle();
}
