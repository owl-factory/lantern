import { Ref } from "@typegoose/typegoose";
import { CampaignModel } from "server/models";
import { CampaignDoc, TableDoc } from "types";

interface CreateCampaignInput {
  name: string;
  table: Ref<TableDoc>;
}

function onUpdate(myUserID: string) {
  return {
    updatedBy: myUserID,
    updatedAt: new Date(),
  };
}

function onCreate(myUserID: string) {
  return {
    ownedBy: myUserID,
    createdAt: new Date(),
    createdBy: myUserID,
    ...onUpdate(myUserID),
  };
}

export class CampaignLogic {
  public static async createCampaign(myUserID: string, data: CreateCampaignInput) {
    const newCampaign = {
      ...data,
      players: [myUserID],
      ...onCreate(myUserID),
    };

    return await CampaignModel.create(newCampaign);
  }

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

  public static async fetchCampaign(myUserID: string, _id: string): Promise<CampaignDoc | null> {
    const campaign = await (
      CampaignModel.findOne()
      .where(`_id`).equals(_id)
      .or([
        { ownedBy: myUserID },
        { players: myUserID },
      ])
      // .populate(`table`)
    );

    return campaign;
  }

  public static async updateCampaign(myUserID: string, _id: string, data: CampaignDoc) {
    const newData = {...data, ...onUpdate(myUserID)};
    console.log(newData)
    await CampaignModel.updateOne({_id}, newData);
  }

  public static async toggleInviteLink(myUserID: string, _id: string) {
    const campaign = await this.fetchCampaign(myUserID, _id);
    if (!campaign) { throw {code: 404, message: "The given campaign does not exist"}; }
    if (campaign.ownedBy?.toString() !== myUserID) { 
      throw {code: 403, message: "You do not have access to modify the invite by link setting"};
    }

    // The campaign has link invites active
    if (campaign.allowLinkInvitation) {
      delete campaign.invitationAddress;
      campaign.allowLinkInvitation = false;

    } else {
      campaign.allowLinkInvitation = true;
      campaign.invitationAddress = "testAddress";
      // TODO - make this a proper address
      // TODO - expiry time?
    }
    console.log(campaign)
    await this.updateCampaign(myUserID, _id, campaign._doc as CampaignDoc);
  }

  public static async attemptJoinByLink(myUserID: string, _id: string, inviteKey: string) {
    const res: {campaign: CampaignDoc | null, justAdded: boolean} = { campaign: null, justAdded: false };
    const errorPacket = { code: 404, message: "The given campaign could not be found" };
    // Grab campaign
    res.campaign = await CampaignModel.findById(_id);
    if (!res.campaign) { throw errorPacket; }
    if (res.campaign.players && myUserID in res.campaign.players) {
      res.justAdded = false;
      return res;
    }

    // Is link enabled? Does link match?
    if (!res.campaign.allowLinkInvitation || res.campaign.invitationAddress !== inviteKey) {
      throw errorPacket;
    }

    res.campaign.players?.push(myUserID);

    await this.updateCampaign(myUserID, _id, res.campaign._doc as CampaignDoc);
    res.justAdded = true;
    return res;
  }
}
