import { NextApiRequest, NextApiResponse } from "next";
import { HTTPHandler } from "../controllers/HttpHandler";
import { CreateEndpointOptions } from "../tests/endpoint";

/**
 * Creates an endpoint with a single method that sets functions to their HTTP methods and
 * executes code within a HTTP Handler object
 * @param options The possible endpoints and their methods used to create a single endpoint
 * @returns A function that is executed by the NextJS API endpoint
 */
export function createEndpoint (options: CreateEndpointOptions) {
  const func = async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = new HTTPHandler(req, res);
    handler.GET = options.GET;
    handler.POST = options.POST;
    handler.PUT = options.PUT;
    handler.PATCH = options.PATCH;
    handler.DELETE = options.DELETE;
    await handler.handle();
  };
  return func;
}
