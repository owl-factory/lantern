import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationResolver } from "../../../../server/resolvers/OrganizationResolver";
import { databaseSetup } from "../../../../utilities/mongo";

export function fetchAllOrganizations() {

  return [
    {
      name: "Owl Factory"
    },
    {
      name: "Witches of the Desert"
    }
  ];
}

export function fetchOrganizationCount() {
  return 50;
}

export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse) {
  try {
    databaseSetup();
    const organizations = await OrganizationResolver.findMany(req.body.filters, req.body.options);
    const organizationCount = fetchOrganizationCount();
    res.status(200).json({
      organizations,
      organizationCount
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e})
  }
}