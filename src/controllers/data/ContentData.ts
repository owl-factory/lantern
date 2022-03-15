import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { ContentDocument } from "types/documents";

class ContentDataManager extends DataManager<Partial<ContentDocument>> {
  public collection = "contents";

  constructor() {
    super("/api/content");

    this.addGroup("owned-contents", isOwner);
    // TODO - content should be grouped by content type and rulesets
  }

  public async loadDocuments(refs: string[]): Promise<Partial<ContentDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ contents: Partial<ContentDocument>[] }>(`/api/contents`, { refs: refs });
    return docs.data.contents;
  }
}

export const ContentData = new ContentDataManager();
