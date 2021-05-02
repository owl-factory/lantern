import { Ref } from "types/user";
import { Model } from "./CoreDocument";


export class CampaignInvite extends Model {
  campaign?: Ref;
  inviteAddress?: string;
  ttl?: Date;
}
