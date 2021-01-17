import { NextApiRequest, NextApiResponse } from "next";


export default async function AdminOrganizations(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)

  // const organizations = fetchAllOrganizations();
  const organization = {_id: "1"}
  res.status(200).json({
    organization
  })
}