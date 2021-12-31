import { Ref64 } from "types";
import { CoreDocument } from "types/documents";


export interface CampaignInviteDocument extends CoreDocument {
  campaign?: { ref: Ref64; };

  inviteAddress?: string;
  ttl?: Date; // TODO - uuuuuuhhh remove? Or rename to something we clean up ourselves? idk
}
