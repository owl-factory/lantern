import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";
import { databaseSetup } from "../../../../utilities/mongo";

/**
 * Fetches a specific organization from the Organization resolver
 * @param req The incoming request
 * @param res The outgoing response
 */
export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse) {
  try {
    databaseSetup();
    const organization = await OrganizationResolver.findOne(req.query.id as string);
    res.status(200).json({
      organization
    });
  } catch (e) {
    res.status(500).json({error: e})
  }
}