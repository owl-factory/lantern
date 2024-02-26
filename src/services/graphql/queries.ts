/* eslint-disable no-restricted-syntax */
import type { QueryResolvers, Session, Todo } from "types/graphql";
import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { ErrGraphql, GraphqlResult, getQueryFields } from "utils/graphql";
import { getContent, getAllContent } from "services/content";

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
      return ErrGraphql(auth);
    }
    const session = auth.data;
    const response: Session = {
      ...session,
      id: session.sessionId,
      activeExpires: session.activePeriodExpiresAt,
      idleExpires: session.idlePeriodExpiresAt,
      user: { ...session.user, id: session.user.userId },
    };

    return response;
  },

  /**
   * If user is authenticated, get a single Content item from the database.
   * @param args - Argument object containing only the `id` of the Content to be retrieved.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns requested Content item.
   */
  content: async (_, args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const content = await getContent(args.id, queryFields);
    return GraphqlResult(content);
  },

  /**
   * If user is authenticated, get all content they have access to from the database. Not long term sustainable, still figuring out query method.
   * @param args - Argument object containing only the `id` of the Content to be retrieved.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns requested Content item.
   */
  allContent: async (_, _args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const content = await getAllContent(queryFields);
    return GraphqlResult(content);
  },

  /**
   * If user is authenticated, get a single Todo item from the database.
   * @param args - Argument object containing only the `id` of the Todo to be retrieved.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns requested Todo item.
   */
  todo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return ErrGraphql(auth);
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
      return ErrGraphql(auth);
    }
    const queryFields = getQueryFields<"todo">(info);
    const todos = database.selectFrom("todo").select(queryFields).execute();
    return todos as Promise<Todo[]>;
  },
};
