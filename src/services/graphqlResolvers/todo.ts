import { type YogaInitialContext as Context } from "graphql-yoga";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import type { TodoUpdate, NewTodo } from "types/database";
import { QueryInfo, getQueryFields } from "utils/graphql";

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
 * Resolver map of all todo resolvers.
 */
export const todoResolvers = {
  Query: {
    todo,
    todos,
  },
  Mutation: {
    createTodo,
    updateTodo,
    deleteTodo,
  },
};
