import { RulesetDocument } from "types/documents";
import { DataManager } from "@owl-factory/data/DataManager";
import { isPublic } from "server/logic/security";
import { isOwner } from "security/documents";
class RulesetDataManager extends DataManager<Partial<RulesetDocument>> {
  public collection = "rulesets";

  constructor() {
    super("/api/rulesets");

    this.addGroup("owned-rulesets", isOwner);
    this.addGroup("public-rulesets", isPublic);
  }
}

export const RulesetData = new RulesetDataManager();
