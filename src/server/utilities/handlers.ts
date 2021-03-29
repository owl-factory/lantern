import { NextApiRequest, NextApiResponse } from "next";
import HTTPHandler from "../../server/response/Response";

export interface CreateEndpointOptions {
  GET?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  POST?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  PUT?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  PATCH?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
  DELETE?: (this: HTTPHandler, req: NextApiRequest) => Promise<void>;
}

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
