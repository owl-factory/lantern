import { DataManager } from "@owl-factory/data/DataManager";
import { isOwner } from "security/documents";
import { UserDocument } from "types/documents";

class UserDataManager extends DataManager<Partial<UserDocument>> {
  public collection = "users";

  constructor() {
    super("/api/users");

    this.addGroup("owned-user", isOwner);
  }
}

export const UserData = new UserDataManager();
