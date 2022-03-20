import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { ContentTypeDocument } from "types/documents";

class ContentTypeDataManager extends DataManager<Partial<ContentTypeDocument>> {
  public collection = "content-types";

  constructor() {
    super();

    // TODO - content types should be deliniated by rulesets
  }

  public async loadDocuments(refs: string[]): Promise<Partial<ContentTypeDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ contentTypes: Partial<ContentTypeDocument>[] }>(
      `/api/content-types`,
      { refs: refs }
    );
    return docs.data.contentTypes;
  }
}

export const ContentTypeData = new ContentTypeDataManager();
