import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { emailRegex } from "utils/regex";

/* Authentication Resolvers */
async function login(_: never, args: { username: string; password: string; setCookie: boolean }) {
  const providerUserId = args.username.toLowerCase();

  // Set Lucia providerId based on whether the userId is an email or not.
  const providerId = emailRegex.test(providerUserId) ? "email" : "username";

  // key is null on authentication failure, on success it contains a userId of the correct identity.
  const key = await luciaAuth.useKey(providerId, providerUserId, args.password);

  if (key === null || key === undefined) {
    return "Username or password is incorrect";
  }

  await luciaAuth.deleteDeadUserSessions(key.userId);
  const session = await luciaAuth.createSession({
    userId: key.userId,
    attributes: {},
  });

  if (args.setCookie) {
    setSessionIdCookie(session.sessionId);
  }

  return session.sessionId;
}

async function logout(_: never, args: { deleteCookie: boolean }) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error;
  }
  const session = auth.data;

  await luciaAuth.deleteDeadUserSessions(session.user.userId);
  await luciaAuth.invalidateSession(session.sessionId);
  if (args.deleteCookie) {
    deleteSessionIdCookie();
  }

  return session.sessionId;
}

async function session() {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error;
  }
  const { sessionId, user, is_api_key, activePeriodExpiresAt, idlePeriodExpiresAt } = auth.data;
  const session = {
    id: sessionId,
    isApiKey: is_api_key,
    activeExpires: activePeriodExpiresAt.toISOString(),
    idleExpires: idlePeriodExpiresAt.toISOString(),
    user: {
      id: user.userId,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      iconUrl: user.icon_url,
    },
  };

  return session;
}

/**
 * Resolver map of all authentication resolvers.
 */
export const authenticationResolvers = {
  Query: {
    session,
  },
  Mutation: {
    login,
    logout,
  },
};
