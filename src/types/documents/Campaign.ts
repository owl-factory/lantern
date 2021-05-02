import { CoreDocument } from "types/documents/CoreDocument";
import { Ref } from "types/user";

/**
 * Represents the campaign and all information contained therein
 */
export class CampaignDoc extends CoreDocument {
  // The ruleset used for this campaign
  ruleset?: Ref;

  // The table that this campaign belongs to
  table?: Ref;

  // The IDs of the users who play in this game
  // TODO - change to ref?
  players?: string[];

  // The date last played
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;

  invitationAddress?: string
}
