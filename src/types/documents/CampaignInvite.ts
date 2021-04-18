import { Ref } from "types/user";
import { CoreDocument } from "./CoreDocument";


export class CampaignInvite extends CoreDocument {
  campaign?: Ref;
  inviteAddress?: string;
  ttl?: Date;
}
