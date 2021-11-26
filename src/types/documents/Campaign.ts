
import { Ref64 } from "types";
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
  ruleset: { ref: Ref64; };
  banner: { ref: Ref64; src: string; };
  players: { ref: Ref64; }[];
  activeScene?: { ref: Ref64 };
  scenes: { ref: Ref64; }[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
