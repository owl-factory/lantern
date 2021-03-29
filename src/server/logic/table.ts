import { Ref } from "@typegoose/typegoose";
import { CampaignLogic, onCreate, onUpdate } from "server";
import { CampaignModel, TableModel } from "server/models";
import { CampaignDoc, Context, RulesetDoc, TableDoc } from "types";

interface CreateTableInput {
  name: string;
  ruleset: Ref<RulesetDoc>
}

interface UpdateTableInput {
  name?: string;
  activeCampaign: Ref<CampaignDoc>;
  campaigns: Ref<CampaignDoc>[];
}

// TODO - export this and have it used elsewhere for consistency
export class TableLogic {
  public static canUserUpdate(myUserID: string, table: TableDoc): boolean {
    return (table.ownedBy === myUserID);
  }

  public static async createTable(myUserID: string, data: CreateTableInput) {
    const newTable = {
      ...data,
      players: [myUserID],
      campaigns: [],
      ...onCreate(myUserID),
    };

    const table = await TableModel.create(newTable);
    const campaignData = {
      name: data.name,
      table,
      ruleset: data.ruleset,
    };
    const campaign = await CampaignLogic.createCampaign(myUserID, campaignData);

    const tableUpdate = { activeCampaign: campaign, campaigns: [campaign] };
    await this.updateTable(myUserID, table._id, tableUpdate);
    const updatedTable = await this.fetchTable(table._id, myUserID);
    return { table: updatedTable, campaign };
  }

  public static async updateTable(myUserID: string, tableID: string, data: UpdateTableInput) {
    return await TableModel.updateOne({_id: tableID}, {...data, ...onUpdate(myUserID)}, { upsert: false });
  }

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
