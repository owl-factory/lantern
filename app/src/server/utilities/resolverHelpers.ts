import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";

/**
 * Finds the id of a document given an id or a unique alias, then returns the 
 * ID and the validity. 
 * 
 * @param model The mongoose model to fetch the id for based on the id/alias
 * @param alias The id/alias of the document to find
 */
async function fetchDocumentID(model: any, alias: string): Promise<[string | undefined, boolean]>  {
  // TODO - the model will be replaced with a super type that ors any document type
  if (alias && !isID(alias)) {
    const document = await model.findOne().where("alias").equals(alias);
    if (!document) {
      return [undefined, false];
    }

    return [document._id, true];
  }

  return [alias, true];
}

/**
 * Finds the ID of the game system, if given an id or alias, 
 * and returns the ID and validity
 * 
 * @param gameSystemID The id/alias of the gamesystem to find the ID of
 */
export async function fetchGameSystemID(gameSystemID: string | undefined): Promise<[string | undefined, boolean]> {
  if (!gameSystemID) { return [undefined, false]; }
  return await fetchDocumentID(GameSystemModel, gameSystemID);
}

/**
 * A function for testing of IDs in the event we expand our definition of IDs
 * @param id The string to check for ID-ness
 */
export function isID(id: string): boolean {
  return id.length === 24
}