import { DataManager } from "@owl-factory/data/DataManager";
import { ContentTypeDocument } from "types/documents";

class ContentTypeDataManager extends DataManager<Partial<ContentTypeDocument>> {
  public collection = "content-types";

  constructor() {
    super("/api/content-types");

    // TODO - content types should be deliniated by rulesets
  }
}

export const ContentTypeData = new ContentTypeDataManager();
