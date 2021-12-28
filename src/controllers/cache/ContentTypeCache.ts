import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { ContentTypeDocument } from "types/documents";

class $ContentTypeCache extends CacheController<ContentTypeDocument> {
  key = "content-type";
  apiURL = '/api/content-types'
}

export const ContentTypeCache = new $ContentTypeCache();
