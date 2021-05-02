import { CommonFaunaData, FaunaRef, UserData } from "types";
import { FaunaDocument, Model } from "./CoreDocument";
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

export class CampaignModel extends Model {
  players?: UserModel[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string;
}
