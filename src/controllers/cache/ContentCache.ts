import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { ContentDocument } from "types/documents";

class $ContentCache extends CacheController<ContentDocument> {
  key = "content";
  apiURL = '/api/contents'
}

export const ContentCache = new $ContentCache();
