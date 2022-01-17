import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { SceneDocument } from "types/documents";

class $SceneCache extends CacheController<SceneDocument> {
  key = "scene";
  apiURL = '/api/scenes'
}

export const SceneCache = new $SceneCache();
