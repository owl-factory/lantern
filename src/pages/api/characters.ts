import { NextApiRequest } from "next";
import { CharacterLogic } from "server/logic/CharacterLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";


/**
 * Creates one or more characters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await CharacterLogic.createMany(req.body.docs);
  this.returnSuccess({ docs: characters });
}

/**
 * Deletes one or many characters
 * @param this The handler class calling this function
 * @param req The request to the server. Must contain a list of ids in the body
 */
async function deleteCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await CharacterLogic.deleteMany(req.body.refs);
  this.returnSuccess({ docs: characters });
}

/**
 * Fetches many campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await CharacterLogic.findMany(req.body.refs);
  this.returnSuccess({ docs: characters });
}

/**
 * Updates one or many characters
 * @param this The handler class calling this function
 * @param req The request to the server. Must contain a list packets with ref and the document patch
 */
async function updateCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await CharacterLogic.updateMany(req.body.docs);
  this.returnSuccess({ docs: characters });
}


export default createEndpoint({
  POST: getCharacters,
  PUT: createCharacters,
  PATCH: updateCharacters,
  DELETE: deleteCharacters,
});
