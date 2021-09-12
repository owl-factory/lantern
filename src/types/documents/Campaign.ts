
import { CoreDocument, RulesetDocument, UserDocument } from "types/documents";
import { ImageDocument } from "./assets";

interface PartialRulesetDocument extends Partial<RulesetDocument> {
  id: string;
}

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  ruleset: PartialRulesetDocument;
  banner?: ImageDocument;
  players?: UserDocument[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
