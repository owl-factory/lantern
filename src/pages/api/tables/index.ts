import { NextApiRequest, NextApiResponse } from "next";
import { TableResolver, authenticateUser } from "server";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createTable(this: HTTPHandler, req: NextApiRequest) {
  await authenticateUser(this);
  const data = await TableResolver.createOne(req.body, this.ctx);
  // const campaign = await CampaignResolver.createOne({
  //   ...req.body,
  //   tableID: table._id,
  // });
  // TableResolver.updateOne({});
  this.returnSuccess(data);
}

export default createEndpoint({PUT: createTable});
