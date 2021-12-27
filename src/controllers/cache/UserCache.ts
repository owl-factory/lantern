import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { UserDocument } from "types/documents";

class $UserCache extends CacheController<UserDocument> {
  key = "user";
  apiURL = '/api/users'
}

export const UserCache = new $UserCache();
