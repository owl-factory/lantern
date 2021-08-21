import { ApiConfigBuilder } from "server/apiConfigBuilder/ApiConfigBuilder";
import { UserDocument } from "types/documents";
import { getServerClient } from "utilities/db";
import { DocumentReference, MyUserDocument } from "./CoreModelLogic";
import { isAdmin, isOwner } from "./security";

const guestFields = [
  "username",
  "displayName",
  "icon",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
  "badges",
];
const updateFields = [
  "displayName",
  "bio",
  "enjoysPlaying",
  "activelySeeking",
  "isPrivate",
];

export const UserLogic = (new ApiConfigBuilder("users")
  // Globals
  // .fields()
  //   .guest(guestFields)
  //   .user(["*"]) // TODO
  //   .admin(["*"])
  // .done()
  // .roles()
  //   .admin(true)
  // .done()

  // /**
  //  * Disables the delete functionality for users. Users cannot be deleted, as they are far too complex,
  //  * but we can disable them and retire them in the future using specific functions
  //  */
  // .delete()
  //   .roles()
  //     .admin(false)
  //   .done()
  // .done()

  // /**
  //  * Initializes the fetch function. Guests and above can view. The fields allowed are inherited.
  //  */
  // .fetch()
  //   .roles()
  //     .guest(true)
  //   .done()
  // .done()

  // /**
  //  * Creates a function to find by username. This can be used for searches of multiple users,
  //  * running login functionality, and viewing a user's page with their username in the URL
  //  */
  // .search("findByUsername", "users_by_username")
  //   .indexFields(["ref"])
  // .done()

  // /**
  //  * Creates the update function. Only a user (or admin) can update themselves. This updates a small selection
  //  * of fields
  //  */
  // .update()
  //   .roles()
  //     .user(isOwner)
  //     .admin(true)
  //   .done()
  //   .setFields(updateFields)
  // .done()

  // /**
  //  * Allows for a user to update specifically a profile image
  //  */
  // .update("updateProfileImage")
  //   .setFields(["icon.ref", "icon.src"])
  //   .roles()
  //     .user(isOwner)
  //     .admin(true)
  //   .done()
  // .done()

.done());
