import { NextApiRequest } from "next";
import { CharacterLogic } from "server/logic/CharacterLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await CharacterLogic.findManyByIDs(req.body.ids);
  this.returnSuccess({ docs: characters });
}

export default createEndpoint({POST: getCharacters});
