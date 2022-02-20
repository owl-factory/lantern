import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { rest } from "@owl-factory/https/rest";
import { Ref64 } from "@owl-factory/types";
import { isOwner } from "server/logic/security";
import { UserDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";

// class $UserData extends CacheController<UserDocument> {
//   key = "user";
//   apiURL = '/api/users'

//   public async updateAvatar(ref: Ref64 | undefined, values: Partial<UserDocument>, method: AssetUploadSource) {
//     if (ref === undefined) { return undefined; }
//     // TODO
//   }
// }

// export const UserData = new $UserData();

class UserDataManager extends DataManager<Partial<UserDocument>> {
  public readonly collection = "campaigns";

  constructor() {
    super();

    this.addGroup("owned-user", isOwner);
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<UserDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ users: Partial<UserDocument>[] }>(`/api/users`, { refs: refs });
    return docs.data.users;
  }
}

export const UserData = new UserDataManager();
