import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { CharacterLogic } from "server/logic/CharacterLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { getUniques } from "utilities/arrays";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCharacters(this: HTTPHandler, _req: NextApiRequest) {
  const characters = await CharacterLogic.searchMyCharacters({ size: 200 });
  const campaignIDs = getUniques(characters, "campaign.ref");
  const campaigns = CampaignLogic.findMany(campaignIDs);
  this.returnSuccess({ characters: characters, campaigns });
}

export default createEndpoint({GET: getMyCharacters});

