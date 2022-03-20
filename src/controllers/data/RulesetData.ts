import { RulesetDocument } from "types/documents";
import { rest } from "@owl-factory/https/rest";
import { DataManager } from "@owl-factory/data/DataManager";
import { isOwner, isPublic } from "server/logic/security";
class RulesetDataManager extends DataManager<Partial<RulesetDocument>> {
  public collection = "rulesets";

  constructor() {
    super();

    this.addGroup("owned-rulesets", isOwner);
    this.addGroup("public-rulesets", isPublic);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<RulesetDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ rulesets: Partial<RulesetDocument>[] }>(`/api/rulesets`, { refs: refs });
    return docs.data.rulesets;
  }
}

export const RulesetData = new RulesetDataManager();
