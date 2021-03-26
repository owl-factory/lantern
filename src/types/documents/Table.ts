import { Ref, Severity, modelOptions, prop } from "@typegoose/typegoose";
import { CampaignDoc } from "./Campaign";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "tables" }, options: { allowMixed: Severity.ALLOW } } )
export class TableDoc extends CoreDocument {
  @prop({ ref: "campaigns" })
  activeCampaign?: Ref<CampaignDoc>;

  // The campaigns played at this table
  // TODO - change to refs?
  @prop({ default: [] })
  campaigns?: string[];

  // All players in this game
  // TODO - change to refs?
  @prop({ default: [] })
  players?: string[];
}
