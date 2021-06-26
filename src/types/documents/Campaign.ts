
import { CoreDocument, UserDocument } from "types/documents";
import { ImageDocument } from "./assets";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  banner?: ImageDocument;
  players?: UserDocument[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
