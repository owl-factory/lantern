import "reflect-metadata";
import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { CharacterLogic } from "server/logic/CharacterLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { getUniques } from "@owl-factory/utilities/arrays";
import { findMany } from "server/logic/many";

export async function getMyCharacters(_req: NextApiRequest) {
  const characters = await CharacterLogic.searchMyCharacters({ size: 200 });
  const charcterIDs = getUniques(characters, "campaign.ref");
  const campaigns = await findMany(CampaignLogic.findMyCampaign, charcterIDs);
  return { characters: characters, campaigns };
}

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCharactersRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getMyCharacters(req));
}

export default createEndpoint({GET: getMyCharactersRequest});

