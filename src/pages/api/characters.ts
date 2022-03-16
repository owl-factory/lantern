import "reflect-metadata";
import { NextApiRequest } from "next";
import { CharacterLogic } from "server/logic/CharacterLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { createMany, deleteMany, findMany, updateMany } from "server/logic/many";


/**
 * Creates one or more characters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await createMany(CharacterLogic.createCharacter, req.body.docs);
  this.returnSuccess({ docs: characters });
}

/**
 * Deletes one or many characters
 * @param this The handler class calling this function
 * @param req The request to the server. Must contain a list of ids in the body
 */
async function deleteCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await deleteMany(CharacterLogic.deleteCharacter, req.body.refs);
  this.returnSuccess({ docs: characters });
}

/**
 * Fetches many campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await findMany(CharacterLogic.findGameCharacter, req.body.refs);
  this.returnSuccess({ characters });
}

/**
 * Updates one or many characters
 * @param this The handler class calling this function
 * @param req The request to the server. Must contain a list packets with ref and the document patch
 */
async function updateCharacters(this: HTTPHandler, req: NextApiRequest) {
  const characters = await updateMany(CharacterLogic.updateMyCharacter, req.body.docs);
  this.returnSuccess({ docs: characters });
}


export default createEndpoint({
  POST: getCharacters,
  PUT: createCharacters,
  PATCH: updateCharacters,
  DELETE: deleteCharacters,
});
