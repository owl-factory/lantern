import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";
import { databaseSetup } from "../../../../utilities/mongo";


export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse) {
  try {
    databaseSetup();
    const organization = await OrganizationResolver.createOne(req.body);
    res.status(200).json({
      organization
    })
  } catch (e) {
    res.status(500).json(e)
  }
}