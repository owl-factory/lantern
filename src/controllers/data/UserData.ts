import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { UserDocument } from "types/documents";

class UserDataManager extends DataManager<Partial<UserDocument>> {
  public collection = "users";

  constructor() {
    super();

    this.addGroup("owned-user", isOwner);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<UserDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ users: Partial<UserDocument>[] }>(`/api/users`, { refs: refs });
    return docs.data.users;
  }
}

export const UserData = new UserDataManager();
