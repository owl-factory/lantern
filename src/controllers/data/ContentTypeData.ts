import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { rest } from "@owl-factory/https/rest";
import { ContentTypeDocument } from "types/documents";

// class $ContentTypeData extends CacheController<ContentTypeDocument> {
//   key = "content-type";
//   apiURL = '/api/content-types'
// }

// export const ContentTypeData = new $ContentTypeData();

class ContentTypeDataManager extends DataManager<Partial<ContentTypeDocument>> {
  public readonly collection = "content-types";

  constructor() {
    super();

    // TODO - content types should be deliniated by rulesets
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<ContentTypeDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ contentTypes: Partial<ContentTypeDocument>[] }>(
      `/api/content-types`,
      { refs: refs }
    );
    return docs.data.contentTypes;
  }
}

export const ContentTypeData = new ContentTypeDataManager();
