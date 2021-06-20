import {  Expr, query as q } from "faunadb";
import { AnyDocument, ImageDocument, UserDocument } from "types/documents";
import { FaunaDocument, FaunaRef } from "types/fauna";
import { toFaunaRef, fromFauna } from "utilities/fauna";
import { getServerClient } from "utilities/db";
import { CoreModelLogic, ImageLogic } from "server/logic";
import { DocumentReference, MyUserDocument } from "./CoreModelLogic";

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

// TODO - change findByIDs/Refs to find by ID. Nothing matters except that they are either
// strings or structs containing { id } or { ref }. Validate refs. Build them from IDs
// if possible. Another @TODO - manually build ref objects (or repair them).

/**
 * Finds a user by their ID and returns sanitized values
 * @param id The id of the user to find
 * @param myID The ID of the current user
 * @param roles The roles of the current user, if any
 */
export async function fetchUser(ref: DocumentReference, myUser: MyUserDocument): Promise<UserDocument | null> {
  const client = getServerClient();
  const user = await CoreModelLogic.fetchByRef(ref);
  if (!user) { return null; }

  if (isOwner(user, myUser)) { return user; }
  return CoreModelLogic.trimRestrictedFields(user as Record<string, unknown>, guestFields);
}

/**
 * Fetches a user by their username
 * @param username The username to search for
 * @param myID The current user's id
 * @param roles The current user's roles
 */
export async function fetchUserByUsername(username: string, myUser: MyUserDocument): Promise<UserDocument | null> {
  const index = await CoreModelLogic.fetchByIndex(
    `users_by_username`,
    [username],
    ["ref"],
    { size: 1 }
  );
  if (index.length === 0 || !index[0].ref) { return null; }

  return await fetchUser({ ref: index[0].ref }, myUser);
}

/**
 * Finds a collection of users by their refs
 * @param refs The refs, given as an array of objects containing ref
 * @param myID The current user's ID
 * @param roles The current user's roles
 * @TODO - combine the user id and roles into a single object? Good idea- do later
 */
export async function fetchUsersFromList(refs: DocumentReference[], myUser: MyUserDocument): Promise<UserDocument[]> {
  const users: Promise<UserDocument>[] = [];
  refs.forEach((ref: DocumentReference) => {
    const user = fetchUser(ref, myUser);
    if (user === null) { return; }

    users.push(user as Promise<UserDocument>);
  });

  return Promise.all(users);
}

/**
 * Updates a single user's document in Fauna
 * @param user The partial user document to update
 * @param myID The id of the current user, to determine access rights
 * @param roles The roles of the current user, to determine access rights
 */
export async function updateUser(user: UserDocument, myUser: MyUserDocument): Promise<UserDocument> {
  const updatedUser = await CoreModelLogic.updateOne(user as Record<string, unknown>, updateFields, myUser, canUpdate);

  if (isOwner(user, myUser)) { return updatedUser; }
  return CoreModelLogic.trimRestrictedFields(updatedUser as Record<string, unknown>, guestFields);
}

function isAdmin(myUser: MyUserDocument) {
  return (myUser.roles.includes("admin"));
}

function isOwner(doc: AnyDocument, myUser: MyUserDocument) {
  return (!doc.ownedBy || doc.ownedBy.id === myUser.id);
}

function canUpdate(user: UserDocument, myUser: MyUserDocument) {
  if (isAdmin(myUser)) { return true; }
  if (isOwner(user, myUser)) {
    return true;
  }
  return false;
}

/**
 * Updates the user's profile image by one of several methods.
 * @param user The user document to update
 * @param body The body of request to update the user image.
 * @param myUser The current user
 */
export async function updateUserImage(user: UserDocument, body: any, myUser: MyUserDocument): Promise<any> {
  if (!canUpdate(user, myUser)) {
    throw { code: 403, message: "You do not have permission to update this user's profile image." };
  }

  let image: ImageDocument | null;
  switch(body.method) {
    case "link":
    case "upload":
      image = await ImageLogic.createImageFromMethod(body.image, body.method, myUser);
      break;
    case "list":
      image = await ImageLogic.fetchImage(
        { id: body.image.id, collection: "images" },
        myUser
      );
      if (!image) { throw {code: 404, message: "Image not found."}; }
      break;
    default:
      throw {code: 501, message: `Function '${body.method}' not implemented.`};
  }

  const targetUser = { ref: user.ref, icon: { ref: image.ref, src: image.src }};
  const updatedUser = await CoreModelLogic.updateOne(targetUser, ["icon"], myUser, () => true);
  return { user: updatedUser, image };
}

