
import { CoreDocument, DocumentModel, FaunaDocument } from "./Model";
import { UserDocument, UserModel } from "./User";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {

  players?: UserDocument[];
  lastPlayed?: Date;
  allowLinkInvitation?: boolean;
  invitationAddress?: string
}

export class CampaignModel extends DocumentModel implements CampaignDocument {


  players?: UserModel[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string;
}
