/**
 * The different kinds of roles a user may have
 * TODO - remove this soon as we're moving away from role-based access
 */
 export enum UserRole {
  Guest="guest",
  User="user",
  Moderator="moderator",
  Admin="admin"
}

/**
 * The readable names for the different kinds of user roles
 */
export const UserRoleReadable = [
  "guest",
  "user",
  "moderator",
  "admin",
];
