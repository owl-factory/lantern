import type { DocumentNode } from "@apollo/client";
import { authenticateSession } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { database } from "lib/database";
import type { TodoUpdate, Todo, NewTodo } from "types/database";
import { getQueryFields } from "utils/graphql";
import { emailRegex } from "utils/regex";

/* Authentication Resolvers */
async function login(_obj, args: { username: string; password: string; setCookie: boolean }) {
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
    console.log("TODO: Make setting cookies work from a resolver.");
  }

  return session.sessionId;
}

/* Todo Resolvers */
async function todo(_obj, args: { id: string }, _context, info: DocumentNode) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return database.selectFrom("todo").where("id", "=", args.id).select(queryFields).executeTakeFirst();
}

async function todos(_obj, _args, _context, info: DocumentNode) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return database.selectFrom("todo").select(queryFields).execute();
}

async function createTodo(_obj, args: NewTodo, _context, info: DocumentNode) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    console.log(auth.error);
    return auth.error; // Apollo server expects us to return `null` and then `throw` and error here, and that sucks!
  }
  const queryFields = getQueryFields<Todo>(info);
  return await database.insertInto("todo").values(args).returning(queryFields).executeTakeFirst();
}

async function updateTodo(_obj, args: TodoUpdate, _context, info: DocumentNode) {
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

async function deleteTodo(_obj, args: { id: string }) {
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
