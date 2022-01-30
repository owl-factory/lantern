import { destroyCookie, getCookie, setCookie } from "@owl-factory/cookies";
import { action, makeObservable, observable } from "mobx";
import { NextApiRequest } from "next";
import { Permission, Role } from "./types";

import * as cookies from "./functionality/cookies";
import * as security from "./functionality/security";
import * as user from "./functionality/user";

export class AuthController<T> {
  public $user: T | undefined;

  // User information broken out from the cookie
  public $role = "default"; // The role a user has
  public $permissions: string[] = []; // The specific permissions a user has outside of their role

  // Roles & Permissions for reference. TODO - should these be moved to global variables?
  public $fullPermissions: Record<string, boolean> = {}; // A collection of all permissions the user has

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
   * Returns the currently logged in user. May be undefined if no user is logged in
   */
   get user(): T | undefined { return this.$user; }
   get isLoggedIn() {
     return this.$user !== undefined;
   }

  /**
   * Loads and reloads everything
   */
  public reload() {
    this.$loadFromCookie();
    this.reloadPermissions();
  }

  // COOKIES
  public $loadFromCookie = cookies.loadFromCookie;
  public $saveToCookie = cookies.saveToCookie;

  // SECURITY
  public buildPermissions = security.buildPermissions;
  public hasPermission = security.hasPermission;
  public reloadPermissions = security.reloadPermissions;
  /**
   * Sets the role of the current user.
   * @override to pull the proper role for the user.
   */
  public $setRole() { this.$role = "default"; }
  /**
   * Sets the permissions of the current user
   * @override to pull the proper permissions for the user
  */
  public $setPermissions() { this.$permissions = []; }

  public fromReq = user.fromReq;
  public resetUser = user.resetUser;
  public setUser = user.setUser;
}
