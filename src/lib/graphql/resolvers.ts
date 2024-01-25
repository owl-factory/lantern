/* eslint-disable no-restricted-syntax */
import { type YogaInitialContext as Context } from "graphql-yoga";
import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { database } from "lib/database";
import type { TodoUpdate, NewTodo } from "types/database";
import { QueryInfo, getQueryFields } from "utils/graphql";
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

/* Todo Resolvers */
async function todo(_: never, args: { id: string }, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
  }
  const queryFields = getQueryFields<"todo">(info);
  return database
    .selectFrom("todo")
    .where("id", "=", args.id)
    .select(queryFields)
    .executeTakeFirst();
}

async function todos(_: never, _args: never, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
  }
  const queryFields = getQueryFields<"todo">(info);
  return database.selectFrom("todo").select(queryFields).execute();
}

async function createTodo(_: never, args: NewTodo, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
  }
  const queryFields = getQueryFields<"todo">(info);
  return await database.insertInto("todo").values(args).returning(queryFields).executeTakeFirst();
}

async function updateTodo(_: never, args: TodoUpdate, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
  }
  const queryFields = getQueryFields<"todo">(info);
  return await database
    .updateTable("todo")
    .where("id", "=", args.id as string)
    .set(args)
    .returning(queryFields)
    .executeTakeFirst();
}

async function deleteTodo(_: never, args: { id: string }) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
  }
  const deletedId = (
    await database.deleteFrom("todo").where("id", "=", args.id).returning("id").executeTakeFirst()
  )?.id;
  if (deletedId !== undefined) {
    return deletedId;
  } else {
    return `Item with ID '${deletedId}' not found in database.`;
  }
}

/**
 * Resolver map of all resolvers for the GraphQL schema.
 */
export const resolvers = {
  Query: {
    todo,
    todos,
  },
  Mutation: {
    login,
    logout,
    createTodo,
    updateTodo,
    deleteTodo,
  },
};
