import { RulesetDocument } from "types/documents";
import { DataManager } from "@owl-factory/data/DataManager";
import { isOwner, isPublic } from "server/logic/security";
class RulesetDataManager extends DataManager<Partial<RulesetDocument>> {
  public collection = "rulesets";

  constructor() {
    super("/api/rulesets");

    this.addGroup("owned-rulesets", isOwner);
    this.addGroup("public-rulesets", isPublic);
  }
}

export const RulesetData = new RulesetDataManager();
