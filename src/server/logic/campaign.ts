import { CampaignModel } from "server/models";
import { CampaignDoc } from "types";

export class CampaignLogic {
  public static async listCampaigns(myUserID: string): Promise<CampaignDoc[]> {
    const campaigns = await (
      CampaignModel.find()
      .or([
        { ownedBy: myUserID },
        { players: myUserID },
      ])
    );

    return campaigns;
  }

  public static async fetchCampaign(_id: string, myUserID: string): Promise<CampaignDoc | null> {
    const campaign = await (
      CampaignModel.findOne()
      .where(`_id`).equals(_id)
      .or([
        { ownedBy: myUserID },
        { players: myUserID },
      ])
      // .populate(`table`)
    );

   
    console.log(campaign);
    return campaign;
  }

}
