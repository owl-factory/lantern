/* eslint-disable no-restricted-syntax */
import type { QueryResolvers, Session, Todo } from "generated/resolvers-types";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { getQueryFields } from "utils/graphql";

/**
 * GraphQL resolver map of all query resolvers. Used for GraphQL request that needs to read data.
 * Joined with mutation resolvers to make the full resolver map.
 */
export const queries: QueryResolvers = {
  /**
   * Authenticates current user session and returns the session.
   * @returns current user session object.
   */
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

  /**
   *  If user is authenticated, get a single Todo item from the database.
   * @param args - Argument object containing only the `id` of the Todo to be retrieved.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns requested Todo item.
   */
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

  /**
   * If user is authenticated, gets a list of all Todo items from the database.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns list of all database Todo items.
   */
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
