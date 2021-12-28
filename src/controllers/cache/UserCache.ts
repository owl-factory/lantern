import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { Ref64 } from "types";
import { UserDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";

class $UserCache extends CacheController<UserDocument> {
  key = "user";
  apiURL = '/api/users'

  public async updateAvatar(ref: Ref64 | undefined, values: Partial<UserDocument>, method: AssetUploadSource) {
    if (ref === undefined) { return undefined; }
    // TODO
  }
}

export const UserCache = new $UserCache();
