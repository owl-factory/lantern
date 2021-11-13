import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { CampaignLogic } from "server/logic";
import { CharacterLogic } from "server/logic/CharacterLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { read } from "utilities/objects";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyCharacters(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const characters = await CharacterLogic.fetchMyCharacters([], { size: 20 }, myUser);
  const campaignIDs = getUniques(characters, "campaign.id");
  const campaigns = CampaignLogic.findManyByIDs(campaignIDs);
  this.returnSuccess({ characters: characters, campaigns });
}

export default createEndpoint({GET: getMyCharacters});

function getUniques(list: string[] | Record<string, unknown>[], target?: string) {
  const values: Record<string, string> = {};
  if (!target) {
    const stringList = list as string[];
    stringList.forEach((item: string) => {
      values[item] = "";
    });
    return Object.keys(values);
  }

  const objectList = list as Record<string, unknown>[];
  objectList.forEach((item: Record<string, unknown>) => {
    values[read(item, target) as string] = "";
  });

  return Object.keys(values);
}
