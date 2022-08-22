import { DataManager } from "@owl-factory/data";
import { ReloadPolicy } from "@owl-factory/data/enums";
import { rest } from "@owl-factory/https";
import { Ref64 } from "@owl-factory/types";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";
import { UserDocument } from "types/documents";

class UserDataManager extends DataManager<Partial<UserDocument>> {
  public collection = "users";

  constructor() {
    super("/api/users");

    this.addGroup("owned-user", isOwner);
  }

  /**
   * Gets a loaded user by their username
   * @param username The username of the user to fetch
   * @returns The loaded user, if any
   */
  public getByUsername(username?: string) {
    if (!username) { return undefined; }
    const allUsers = this.data.getAll();
    username = username.toLowerCase().trim();
    const keys = Object.keys(allUsers);
    for (const key of keys) {
      const user = allUsers[key].doc;
      if (user.username?.toLowerCase() === username) { return user; }
    }
    return undefined;
  }

  /**
   * Loads one user in by their username
   * @param username The usernames of users to load from the database
   */
   public async loadByUsername(
    username: string | null | undefined,
    reloadPolicy?: ReloadPolicy
  ): Promise<void> {
    // Exits early if the username is invalid
    if (username === null || username === undefined || username.length === 0) { return; }

    // Checks if the user is already loaded, then loads using the standard load method if it is
    const loadedUser = this.getByUsername(username);
    if (loadedUser) {
      this.load(loadedUser.ref, reloadPolicy);
      return;
    }

    // If the user is not loaded at all, attempt to load using the profile method
    let user;
    try {
      user = (await rest.get<{ user: UserDocument }>(`/api/profile/${username}`)).data.user;
    } catch (e) {
      // TODO - log
      return;
    }

    if (user === undefined) { return; }
    this.set(user, true);

    return;
  }

  /**
   * Updates a user's profile
   * @param ref The ref of the user to update
   * @param values The profile values of the user to update
   */
  public async updateProfile(ref: Ref64, values: any) {
    console.log(ref)
    // TODO - better functionality for 'canUpdateProfile'
    if (!Auth.isLoggedIn || Auth.ref !== ref || !ref) { return false; }
    values.ref = ref;
    this.$update([values]);
  }
}

export const UserData = new UserDataManager();
