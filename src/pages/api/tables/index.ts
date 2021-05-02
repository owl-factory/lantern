import { NextApiRequest } from "next";
import { TableLogic } from "server";
import { authenticate } from "utilities/auth";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createTable(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }
  const data = await TableLogic.createTable(session.user.ref.id, req.body);
  console.log(data);
  this.returnSuccess(data);
}

export default createEndpoint({PUT: createTable});
