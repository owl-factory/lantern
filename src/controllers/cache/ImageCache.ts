import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { ImageDocument } from "types/documents";

class $ImageCache extends CacheController<ImageDocument> {
  key = "content";
  apiURL = '/api/images'
}

export const ImageCache = new $ImageCache();
