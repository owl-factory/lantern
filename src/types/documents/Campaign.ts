
import { Ref64 } from "src/database/fauna";
import { CoreDocument, RulesetDocument, UserDocument } from "types/documents";
import { ImageDocument } from "./assets";

interface PartialRulesetDocument extends Partial<RulesetDocument> {
  id: string;
}

interface PartialBanner extends Partial<ImageDocument> {
  id: Ref64,
  src: string
}

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  ruleset: PartialRulesetDocument;
  banner: PartialBanner;
  players?: UserDocument[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
