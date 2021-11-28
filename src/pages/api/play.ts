import { NextApiRequest } from "next";
import { GiTripleShells } from "react-icons/gi";
import { CampaignLogic } from "server/logic/CampaignLogic";
import { ContentLogic } from "server/logic/ContentLogic";
import { RulesetLogic } from "server/logic/RulesetLogic";
import { SceneLogic } from "server/logic/SceneLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { getUniques } from "utilities/arrays";

/**
 * Fetches all of a user's campaigns
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getGame(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findByID(req.body.ref);

  if (!req.body.defer) {
    const ruleset = await RulesetLogic.findByID(campaign.ruleset.ref);
    const scene = await SceneLogic.findByID(campaign.activeScene?.ref as string);
    this.returnSuccess({ campaign: campaign, ruleset: ruleset, scene: scene });
  } else {
    const sceneRefs = getUniques(campaign.scenes, "ref");
    // Saves us one unneeded db call
    const activeSceneIndex = sceneRefs.indexOf(campaign.activeScene?.ref as string);
    // if (activeSceneIndex >= 0) { sceneRefs.splice(activeSceneIndex, 1); }

    const scenes = await SceneLogic.findManyByIDs(sceneRefs);
    console.log("scenes:",scenes);
    this.returnSuccess({ scenes: scenes });
  }
}

export default createEndpoint({POST: getGame});
