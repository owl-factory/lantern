import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { User } from "lucia";
import { isBadPassword } from "utils/authentication";
import { emailRegex } from "utils/regex";
import { Err, Ok } from "utils/results";

/**
 * Create a new user with an email, username and password.
 * @param email - Email for the new user.
 * @param username - Username for the new user.
 * @param password - Password for the new user. Only a hash of this password will be saved to the database.
 * @param logIn - Whether to immediately log in the new user and create a session.
 * @param setCookie - Whether to create a cookie for the new session (pass true for yes, create a cookie). Does nothing if `logIn` is false.
 * @param displayName - Optional display name for new user row.
 * @returns session ID of the new session if `logIn` is true, otherwise a message.
 */
export async function signupUser(
  email: string,
  username: string,
  password: string,
  logIn: boolean,
  setCookie: boolean,
  displayName?: string
): Promise<Result<string>> {
  if (isBadPassword(password)) {
    return Err(
      "Password does not meet requirements. Password should be between 8 and 40 characters and not be a commonly used password."
    );
  }

  // Create user and login key (email)
  const user = await luciaAuth.createUser({
    userId: crypto.randomUUID(),
    key: {
      providerId: "email",
      providerUserId: email.toLowerCase(),
      password: password,
    },
    attributes: {
      email: email,
      username: username,
      display_name: displayName ?? undefined,
    } as never,
  });

  // Create secondary login key (username)
  await luciaAuth.createKey({
    userId: user.userId,
    providerId: "username",
    providerUserId: username.toLowerCase(),
    password: password,
  });

  if (logIn) {
    // Create session for new user
    const session = await luciaAuth.createSession({
      userId: user.userId,
      attributes: {} as never,
    });
    if (setCookie) {
      setSessionIdCookie(session.sessionId);
    }
    return Ok(session.sessionId);
  }
  return Ok("Session not created for new user.");
}

/**
 * Creates a session for a user by logging in with a username/email and password.
 * In the future we will support other login methods.
 * @param username - username or email of the user to log in.
 * @param password - password of user to log in, will be hashed to verify and then discarded.
 * @param setCookie - whether to create a cookie for the current session (pass true for yes, create  a cookie).
 * @returns ID of the newly created user session.
 */
export async function loginUser(
  username: string,
  password: string,
  setCookie: boolean
): Promise<Result<string>> {
  const providerUserId = username.toLowerCase();
  // Set Lucia providerId based on whether the userId is an email or not.
  const providerId = emailRegex.test(providerUserId) ? "email" : "username";

  // key is null on authentication failure, on success it contains a userId of the correct identity.
  const key = await luciaAuth.useKey(providerId, providerUserId, password);
  password = "";

  if (key === null || key === undefined) {
    return Err("Username or password is incorrect");
  }

  await luciaAuth.deleteDeadUserSessions(key.userId);
  const session = await luciaAuth.createSession({
    userId: key.userId,
    attributes: {} as never,
  });

  if (setCookie) {
    setSessionIdCookie(session.sessionId);
  }

  return Ok(session.sessionId);
}

export async function logoutSession(deleteCookie: boolean): Promise<Result<string>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }
  const session = auth.data;

  await luciaAuth.deleteDeadUserSessions(session.user.userId);
  await luciaAuth.invalidateSession(session.sessionId);
  if (deleteCookie) {
    deleteSessionIdCookie();
  }

  return Ok(session.sessionId);
}

/**
 * Permanently deletes the current session `user` and all associated database rows if the correct user ID and username are provided.
 * This function will be updated later to support admin functionality and to delete owned content without other owners or inheritors.
 * @param id - ID of user to delete, must match current session user.
 * @param username - Username of user to delete, must match current session user and provided ID.
 * @param deleteCookie - Whether to also delete the current session cookie (pass `true` for yes, delete the session cookie).
 * @returns ID of deleted user, or an error.
 */
export async function deleteUser(
  id: string,
  username: string,
  deleteCookie: boolean
): Promise<Result<string>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }
  const session = auth.data;
  let userToDelete: User;
  if (id === session.user.userId) {
    userToDelete = session.user;
  } else if (false) {
    // TODO handle allowing Admins to delete any user by fetching them and setting userToDelete
  } else {
    return Err("You do not have permission to delete this user.");
  }
  if (username !== userToDelete.username) {
    return Err("Provided username does not match the username of the user found with provided id.");
  }

  await luciaAuth.deleteUser(session.user.userId);

  if (deleteCookie && session.user.userId === userToDelete.userId) {
    deleteSessionIdCookie();
  }

  return Ok(userToDelete.userId);
}
