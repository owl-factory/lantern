import { NextApiRequest, NextApiResponse } from "next";

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
  const organizations = fetchAllOrganizations();
  const organizationCount = fetchOrganizationCount();
  res.status(200).json({
    organizations,
    organizationCount
  })
}