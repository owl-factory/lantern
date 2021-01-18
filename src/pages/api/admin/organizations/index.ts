import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";
import { databaseSetup } from "../../../../utilities/mongo";

/**
 * Fetches a collection of organizations from 
 * @param req The incoming request
 * @param res The outgoing response
 */
export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse) {
  try {
    databaseSetup();
    const organizations = await OrganizationResolver.findMany(req.body.filters, req.body.options);
    const organizationCount = await OrganizationResolver.findCount(req.body.filters);
    res.status(200).json({
      organizations,
      organizationCount
    });
  } catch (e) {
    res.status(500).json({error: e})
  }
}