import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { CharacterDocument } from "types/documents";

class $CharacterCache extends CacheController<CharacterDocument> {
  key = "character";
  apiURL = '/api/characters'
}

export const CharacterCache = new $CharacterCache();
