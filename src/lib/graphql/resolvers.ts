import { type DocumentNode } from "@apollo/client";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { type Todo } from "types/database";
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

export const resolvers = {
  Query: {
    todo,
    todos,
  },
};
