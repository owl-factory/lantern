import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { ContentDocument } from "types/documents";

// class $ContentData extends CacheController<ContentDocument> {
//   key = "content";
//   apiURL = '/api/contents'
// }

// export const ContentData = new $ContentData();

class ContentDataManager extends DataManager<Partial<ContentDocument>> {
  public readonly collection = "contents";

  constructor() {
    super();

    this.addGroup("owned-contents", isOwner);
    // TODO - content should be grouped by content type and rulesets
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<ContentDocument>[]> {
    if (refs.length) { return []; }
    const docs = await rest.post<{ contents: Partial<ContentDocument>[] }>(`/api/contents`, { refs: refs });
    return docs.data.contents;
  }
}

export const ContentData = new ContentDataManager();
