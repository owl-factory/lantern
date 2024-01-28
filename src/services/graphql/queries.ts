/* eslint-disable no-restricted-syntax */
import type { QueryResolvers, Session, Todo } from "generated/resolvers-types";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { getQueryFields } from "utils/graphql";

/**
 * Resolver map of all query resolvers.
 */
export const queries: QueryResolvers = {
  session: async () => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      throw auth.error; // GraphQL expects us to `throw` an error here, and that sucks!
    }
    const { sessionId, user, isApiKey, activePeriodExpiresAt, idlePeriodExpiresAt } = auth.data;
    const session: Session = {
      id: sessionId,
      isApiKey: isApiKey,
      activeExpires: activePeriodExpiresAt.toISOString(),
      idleExpires: idlePeriodExpiresAt.toISOString(),
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
      },
    };

    return session;
  },

  todo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      throw auth.error; // GraphQL expects us to `throw` an error here, and that sucks!
    }
    const queryFields = getQueryFields<"todo">(info);
    const todo = database
      .selectFrom("todo")
      .where("id", "=", args.id)
      .select(queryFields)
      .executeTakeFirst();
    return todo as Promise<Todo>;
  },

  todos: async (_, _args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      throw auth.error; // GraphQL expects us to `throw` an error here, and that sucks!
    }
    const queryFields = getQueryFields<"todo">(info);
    const todos = database.selectFrom("todo").select(queryFields).execute();
    return todos as Promise<Todo[]>;
  },
};
