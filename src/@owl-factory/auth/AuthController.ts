import { destroyCookie, getCookie, setCookie } from "@owl-factory/cookies";
import { action, makeObservable, observable } from "mobx";
import { Permission, Role } from "./types";

export class AuthController<T> {
  public $user: T | undefined;
  public $role = "default"; // The role a user has
  public $permissions: string[] = []; // The specific permissions a user has outside of their role

  public $fullPermissions: Record<string, boolean> = {}; // A collection of all permissions the user has

  protected allRoles: Record<string, Role> = {}; // All roles currently in use
  public allPermissions: Permission[] = []; // All permissions currently  in use

  protected cookieKey = "session";

  constructor() {
    this.reload();
    makeObservable(this, {
      $user: observable,
      resetUser: action,
      setUser: action,
    });
  }

  /**
   * Loads and reloads everything
   */
  public reload() {
    this.loadFromCookie();
    this.reloadPermissions();
  }

  /**
   * Checks if the current user has a given permission
   * @param permission The permission key to check if present
   */
  public hasPermission(permission: string) {
    return (permission in this.$fullPermissions);
  }

  /**
   * Combines all of the user's role and custom permissions into one struct for easy
   * reference
   */
  protected buildPermissions() {
    this.$fullPermissions = {};
    let rolePermissions: string[] = [];
    if (this.$role && this.$role in this.allRoles) {
      const role = this.allRoles[this.$role];
      rolePermissions = role.permissions;
    }

    const summedPermissions = rolePermissions.concat(this.$permissions);
    summedPermissions.forEach((permission: string) => {
      this.$fullPermissions[permission] = true;
    });
  }

  /**
   * Reruns all of the permission determination code
   */
  public reloadPermissions() {
    this.setRole();
    this.setPermissions();
    this.buildPermissions();
  }

  /**
   * Returns the currently logged in user. May be undefined if no user is logged in
   */
  public getUser(): T | undefined { return this.$user; }
  /**
   * Resets the user and the AuthController to the default state
   */
  public resetUser() {
    destroyCookie(this.cookieKey);
    this.$user = undefined;
    this.reloadPermissions();
  }
  /**
   * Sets a new user
   * @param user The new user that is being logged in or authenticated
   */
  public setUser(user: T) {
    this.resetUser();
    this.$user = user;
    this.reloadPermissions();

    this.saveToCookie();
  }

  get isLoggedIn() {
    return this.$user !== undefined;
  }

  /**
   * Sets the role of the current user.
   * Overload to pull the proper role for the user.
   */
  protected setRole() {
    this.$role = "default";
  }

  /**
   * Sets the permissions of the current user
   * Overload to pull the proper permissions for the user
   */
  protected setPermissions() {
    this.$permissions = [];
  }

  /**
   * Loads the user from the cookie, if any present
   */
  protected loadFromCookie() {
    const session = getCookie(this.cookieKey);
    if (session === undefined) { return; }
    this.$user = session;
  }

  /**
   * Saves the user to the cookie, if any is present
   */
  protected saveToCookie() {
    if (this.$user === undefined) { return; }
    setCookie(this.cookieKey, this.$user);
  }
}
