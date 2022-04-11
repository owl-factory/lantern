
import { importMigrations } from "@owl-factory/database/migrations/fauna";
import { Ref64 } from "@owl-factory/types";
import { isClient } from "@owl-factory/utilities/client";
import { Collection } from "fauna";
import { CoreDocument } from "types/documents";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  ruleset: { ref: Ref64; };
  banner: { ref: Ref64; src: string; };
  players?: { ref: Ref64; }[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
