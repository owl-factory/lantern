import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createExternalImage(this: HTTPHandler, req: NextApiRequest) {
  const image = await ImageLogic.createExternalLink(req.body);

  this.returnSuccess({ image });
}

export default createEndpoint({PUT: createExternalImage});
