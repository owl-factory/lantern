import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { User } from "lucia";
import { isBadPassword } from "utils/authentication";
import { emailRegex } from "utils/regex";
import { Err, Ok } from "utils/results";

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
      displayName: displayName || undefined,
    },
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
      attributes: {},
    });
    if (setCookie) {
      setSessionIdCookie(session.sessionId);
    }
    return Ok(session.sessionId);
  }
  return Ok("Session not created for new user.");
}

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

  if (key === null || key === undefined) {
    return Err("Username or password is incorrect");
  }

  await luciaAuth.deleteDeadUserSessions(key.userId);
  const session = await luciaAuth.createSession({
    userId: key.userId,
    attributes: {},
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
