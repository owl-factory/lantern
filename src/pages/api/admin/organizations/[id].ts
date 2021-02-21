import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";
import HTTPHandler from "../../../../server/response/Response";
import unhandled from "../../../../server/utilities/unhandled";

/**
 * Fetches a specific organization from the Organization resolver
 * @param req The incoming request
 * @param res The outgoing response
 */
async function getOrganization(req: NextApiRequest, res: NextApiResponse) {
  const organization = await OrganizationResolver.findOne(req.query.id as string);
  res.status(200).json({
    organization,
  });
}

async function deleteOrganization(req: NextApiRequest, res: NextApiResponse) {
  const deleteResponse = await OrganizationResolver.deleteOne(req.query.id as string);
  res.status(200).json({
    deleteResponse,
  });
}

export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const handler = new HTTPHandler(req, res);
  handler.GET = getOrganization;
  handler.DELETE = deleteOrganization;
  await handler.handle();
  unhandled(res);
}
