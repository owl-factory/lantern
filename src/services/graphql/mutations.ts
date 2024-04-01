/* eslint-disable no-restricted-syntax */
import type { MutationResolvers } from "types/graphql";
import { GraphqlResult, getQueryFields } from "utils/graphql";
import { deleteUser, loginUser, logoutSession, signupUser } from "services/authentication";
import { createContent, deleteContent, updateContent } from "services/content";

/**
 * GraphQL resolver map of all mutation resolvers. Used for GraphQL request that needs to write data.
 * Joined with query resolvers to make the full resolver map.
 */
export const mutations: MutationResolvers = {
  /**
   * GraphQL resolver wrapping the authentication service's {@link services/authentication#signupUser | signupUser}.
   * @param args - Sign up form fields.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns void or the `id` of a session for the newly created user.
   */
  signup: async (_, args) => {
    const res = await signupUser(
      args.email,
      args.username,
      args.password,
      args.logIn,
      args.setCookie,
      args.displayName ?? undefined
    );
    return GraphqlResult(res);
  },

  /**
   * Authenticate a user with their credentials and create a session for them, which will always be returned by the resolver but may
   * also be save to a cookie if the `setCookie` argument is `true`.
   * @param args - Argument object containing `username: string` (username or email of the account to log in to), `password: string`,
   * and `setCookie: boolean` fields.
   * @returns ID of the session generated for a newly logged in user.
   */
  login: async (_, args) => {
    const res = await loginUser(args.username, args.password, args.setCookie);
    return GraphqlResult(res);
  },

  /**
   * Authenticate a user session and then log out (delete) that session. Will also try to delete the associated cookie if `deleteCookie` argument is `true`.
   * @param args - Argument object containing just `deleteCookie: boolean`.
   * @returns ID of the session that was just logged out.
   */
  logout: async (_, args) => {
    const res = await logoutSession(args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * If authenticates, deletes a user.
   * @param args - A the `id` and `username` fields of the user to delete. They must match, and both are required to make user deletion require more intention.
   * @returns `id` of the deleted user.
   */
  deleteUser: async (_, args) => {
    const res = await deleteUser(args.id, args.username, args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, creates a new Content item in the database.
   * @param args - Fields that make up a Content database object, with some optional fields or fields with defaults potentially not included.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns newly created Content object filtered to requested fields.
   */
  createContent: async (_, args, _context, info) => {
    const queryFields = getQueryFields<"content">(info);
    const res = await createContent(
      { ...args, visibility: args.visibility ?? undefined },
      queryFields
    );
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, creates a new Content item in the database.
   * @param args - Object with the `id` of a Content item to update and the fields to be updated.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns modified Content object from database filtered to requested fields.
   */
  updateContent: async (_, args, _context, info) => {
    const contentUpdate = {
      name: args.name ?? undefined,
      data: args.data ?? undefined,
      visibility: args.visibility ?? undefined,
      isDynamic: args.isDynamic ?? undefined,
    };
    const queryFields = getQueryFields<"content">(info);
    const res = await updateContent(args.id, contentUpdate, queryFields);
    return GraphqlResult(res);
  },

  /**
   * If user is authenticated, deletes a Content item from the database.
   * @param args - Argument object containing only the `id` of the Content to be deleted.
   * @returns `id` of the deleted Content.
   */
  deleteContent: async (_, args) => {
    const res = await deleteContent(args.id);
    return GraphqlResult(res);
  },
};
