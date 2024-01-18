import { type YogaInitialContext as Context } from "graphql-yoga";
import { authenticateSession, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { database } from "lib/database";
import type { TodoUpdate, Todo, NewTodo } from "types/database";
import { type TypedDocumentNode as QueryInfo } from "urql";
import { getQueryFields } from "utils/graphql";
import { emailRegex } from "utils/regex";

/* Authentication Resolvers */
async function login(_, args: { username: string; password: string; setCookie: boolean }) {
  const providerUserId = args.username.toLowerCase();

  // Set Lucia providerId based on whether the userId is an email or not.
  const providerId = emailRegex.test(providerUserId) ? "email" : "username";

  // key is null on authentication failure, on success it contains a userId of the correct identity.
  const key = await luciaAuth.useKey(providerId, providerUserId, args.password);

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

/* Todo Resolvers */
async function todo(_, args: { id: string }, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return database.selectFrom("todo").where("id", "=", args.id).select(queryFields).executeTakeFirst();
}

async function todos(_, _args, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return database.selectFrom("todo").select(queryFields).execute();
}

async function createTodo(_, args: NewTodo, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return await database.insertInto("todo").values(args).returning(queryFields).executeTakeFirst();
}

async function updateTodo(_, args: TodoUpdate, _context: Context, info: QueryInfo) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return await database
    .updateTable("todo")
    .where("id", "=", args.id)
    .set(args)
    .returning(queryFields)
    .executeTakeFirst();
}

async function deleteTodo(_, args: { id: string }) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  return (await database.deleteFrom("todo").where("id", "=", args.id).returning("id").executeTakeFirst()).id;
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
    createTodo,
    updateTodo,
    deleteTodo,
  },
};
