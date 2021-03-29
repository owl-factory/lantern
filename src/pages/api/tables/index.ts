import { NextApiRequest } from "next";
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
  const table = await TableResolver.createOne(req.body, this.ctx);
  this.returnSuccess({ table });
}

export default createEndpoint({PUT: createTable});
