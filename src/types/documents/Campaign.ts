
import { CoreDocument, RulesetDocument, UserDocument } from "types/documents";
import { ImageDocument } from "./assets";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  ruleset?: RulesetDocument;

  banner?: ImageDocument;
  players?: UserDocument[];
  lastPlayedAt?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
