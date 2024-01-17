import type { DocumentNode } from "@apollo/client";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import type { TodoUpdate, Todo, NewTodo } from "types/database";
import { getQueryFields } from "utils/graphql";

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

export const resolvers = {
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
