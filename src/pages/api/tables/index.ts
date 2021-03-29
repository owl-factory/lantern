import { NextApiRequest } from "next";
import { TableLogic, authenticateUser } from "server";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createTable(this: HTTPHandler, req: NextApiRequest) {
  const user = await authenticateUser(this);
  if (!user || !user._id) { return; }
  const data = await TableLogic.createTable(user._id, req.body);
  console.log(data);
  this.returnSuccess(data);
}

export default createEndpoint({PUT: createTable});
