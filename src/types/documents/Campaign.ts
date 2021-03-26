import { Ref, prop } from "@typegoose/typegoose";
import { CoreDocument } from "types/documents/CoreDocument";
import { RulesetDoc, TableDoc } from "types";

/**
 * Represents the campaign and all information contained therein
 */
export class CampaignDoc extends CoreDocument {
  // The ruleset used for this campaign
  @prop({ ref: "rulesets" })
  ruleset?: Ref<RulesetDoc>;

  // The table that this campaign belongs to
  @prop({ ref: "tables", required: true })
  table?: Ref<TableDoc>;

  // The IDs of the users who play in this game
  // TODO - change to ref?
  @prop({ default: [] })
  players?: string[];
}
