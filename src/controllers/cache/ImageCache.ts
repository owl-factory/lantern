import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { ImageDocument } from "types/documents";

class $ImageCache extends CacheController<ImageDocument> {
  key = "image";
  apiURL = '/api/images'
}

export const ImageCache = new $ImageCache();
