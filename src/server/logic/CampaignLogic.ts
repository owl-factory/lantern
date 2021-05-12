import { getServerClient } from "utilities/db";
import { query as q } from "faunadb";
import { mapFauna, smoothFauna } from "utilities";
import { CampaignDocument, UserDocument } from "types";
import { CoreModelLogic } from "./CoreModelLogic";

enum CampaignAccessLevels {
  GUEST,
  PLAYER,
  OWNER,
  ADMIN,
}

const allowedPlayerFields = [
  "lastPlayed",
  "players",
];

const allowedGuestFields: string[] = [];

export class CampaignLogic {
  /**
   * Fetches a campaign by the id and validates against the user's id
   * @param id The id of the campaign to fetch
   * @param myID The current user's ID
   * @param roles The roles of the user, if any
   */
  public static async fetchCampaignByID(
    id: string,
    myID: string,
    roles?: string[]
  ): Promise<CampaignDocument | null> {
    const client = getServerClient();
    const rawCampaign: Record<string, unknown> = await client.query(q.Get(q.Ref(q.Collection("campaigns"), id)));

    if (!rawCampaign) { return null; }
    let campaign: CampaignDocument = mapFauna(rawCampaign);
    const accessLevel = this.determineAccessLevel(campaign, myID, roles);
    campaign = this.trimRestrictedFields(campaign, accessLevel);

    return campaign;
  }

  /**
   * Determines which access level the current user has access to
   * @param campaign The campaign we are determining access level of
   * @param myID The owner ID
   * @param roles The roles of the user, if any
   */
  public static determineAccessLevel(
    campaign: CampaignDocument,
    myID: string,
    roles: string[] = []
  ): CampaignAccessLevels {
    if ("ADMIN" in roles) { return CampaignAccessLevels.ADMIN; }
    if (campaign.ownedBy && campaign.ownedBy.id === myID) { return CampaignAccessLevels.OWNER; }
    if (!campaign.players || campaign.players.length === 0) { return CampaignAccessLevels.GUEST; }
    campaign.players.forEach((player: UserDocument) => {
      if (player.id === myID) { return CampaignAccessLevels.PLAYER; }
    });

    return CampaignAccessLevels.GUEST;
  }

  /**
   * Determines which fields should be kept when trimming restricted fields
   * @param campaign The campaign object to trim
   * @param accessLevel The level to trim for
   */
  public static trimRestrictedFields(campaign: CampaignDocument, accessLevel: CampaignAccessLevels): CampaignDocument {
    if (accessLevel === CampaignAccessLevels.ADMIN || accessLevel === CampaignAccessLevels.OWNER) {
      return campaign;
    } else if (accessLevel === CampaignAccessLevels.PLAYER) {
      return CoreModelLogic.trimRestrictedFields(campaign as Record<string, unknown>, allowedPlayerFields);
    }
    return CoreModelLogic.trimRestrictedFields(campaign as Record<string, unknown>, allowedGuestFields);
  }
}
