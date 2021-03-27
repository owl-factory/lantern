import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";

import { HTTPHandler } from "server";

/**
 * Creates a new content type
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getOrganizations(this: HTTPHandler, req: NextApiRequest) {
  const organization = await OrganizationResolver.createOne(req.body, this.ctx);
  this.returnSuccess({ organization });
}

/**
 * Handles the admin organization endpoint
 * @param req The request to the server
 * @param res The result from the server to be sent back
 */
export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getOrganizations;
  await handler.handle();
}
