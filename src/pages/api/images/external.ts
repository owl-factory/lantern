import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { CampaignLogic } from "server/logic";
import { UserLogic } from "server/logic/UserLogic";
import { UserDocument } from "types/documents";
import { createEndpoint } from "server/utilities";
import { ImageLogic } from "server/logic";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createExternalImage(this: HTTPHandler, req: NextApiRequest) {
  const userID = "295863299256353286";
  const image = await ImageLogic.createExternalImage(req.body, userID);

  this.returnSuccess({ image });
}

export default createEndpoint({PUT: createExternalImage});
