import { CommonFaunaData, FaunaRef, UserData } from "types";
import { DocumentModel, FaunaDocument } from "./Model";
import { UserModel } from "./User";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignData extends CommonFaunaData {

  players: (FaunaRef | FaunaDocument<UserData>)[];


  lastPlayed?: Date;

  allowLinkInvitation?: boolean;

  invitationAddress?: string
}

export class CampaignModel extends DocumentModel {
  public static config = {
    collection: "campaigns",
    findByIDMethod: "view_campaign_page",
  }

  players?: UserModel[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string;
}
