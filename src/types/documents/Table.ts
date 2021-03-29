import { Ref, Severity, modelOptions, prop } from "@typegoose/typegoose";
import { UserProfileDoc } from "types";
import { CampaignDoc } from "./Campaign";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "tables" }, options: { allowMixed: Severity.ALLOW } } )
export class TableDoc extends CoreDocument {
  @prop({ ref: "campaigns" })
  activeCampaign?: Ref<CampaignDoc>;

  // The campaigns played at this table
  // TODO - change to refs?
  @prop({ ref: "campaigns", default: [] })
  campaigns?: Ref<CampaignDoc>[];

  // All players in this game
  // TODO - change to refs?
  @prop({ ref: "userProfiles", default: [] })
  players?: Ref<UserProfileDoc>[];
}
