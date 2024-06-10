/* eslint-disable no-restricted-syntax */
import type { QueryResolvers, Session } from "types/graphql";
import { authenticateSession } from "lib/authentication";
import { ErrGraphql, GraphqlResult, getQueryFields } from "utils/graphql";
import { getContent, getContentSet } from "services/content";

/**
 * GraphQL resolver map of all query resolvers. Used for GraphQL request that needs to read data.
 * Joined with mutation resolvers to make the full resolver map.
 */
export const queries: QueryResolvers = {
  /**
   * GraphQL query resolver wrapping the authentication lib's {@link lib/authentication#authenticateSession | authenticateSession} function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
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
   * GraphQL query resolver wrapping the content service's {@link services/content#getContent | getContent} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @param info - GraphQL query info object that contains the list of fields to be returned.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  content: async (_, args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const content = await getContent(args.id, queryFields);
    return GraphqlResult(content);
  },

  /**
   * GraphQL query resolver wrapping the content service's {@link services/content#getContentSet | getContentSet} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @param info - GraphQL query info object that contains the list of fields to be returned.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  contentSet: async (_, args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const content = await getContentSet(queryFields, args.contentTypeId ?? undefined);
    return GraphqlResult(content);
  },
};
