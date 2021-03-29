import { getUser } from "server";
import { CampaignModel, TableModel } from "server/models";
import { CampaignDoc, Context, TableDoc } from "types";

// TODO - export this and have it used elsewhere for consistency
export class TableLogic {
  // public static async listCampaigns(myUserID: string): Promise<CampaignDoc[]> {
  //   const campaigns = await (
  //     CampaignModel.find()
  //     .or([
  //       { ownedBy: myUserID },
  //       { players: myUserID },
  //     ])
  //   );

  //   return campaigns;
  // }

  public static async fetchTable(_id: string, myUserID: string): Promise<TableDoc | null> {
    const table = await (
      TableModel.findOne()
      .where(`_id`).equals(_id)
      .or([
        { ownedBy: myUserID },
        { players: myUserID },
      ])
    );

    console.log(table);
    return table;
  }

}
