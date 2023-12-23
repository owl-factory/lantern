import { Ref64 } from "types";
import { BaseDocument } from "types/documents";


export interface CampaignInviteDocument extends BaseDocument {
  campaign?: { ref: Ref64; };

  inviteAddress?: string;
  ttl?: Date; // TODO - uuuuuuhhh remove? Or rename to something we clean up ourselves? idk
}
