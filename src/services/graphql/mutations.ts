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
   * GraphQL mutation resolver wrapping the authentication service's  {@link services/authentication#signupUser | signupUser} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
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
   * GraphQL mutation resolver wrapping the authentication service's {@link services/authentication#loginUser | loginUser} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  login: async (_, args) => {
    const res = await loginUser(args.username, args.password, args.setCookie);
    return GraphqlResult(res);
  },

  /**
   * GraphQL mutation resolver wrapping the authentication service's {@link services/authentication#logoutSession | logoutSession} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  logout: async (_, args) => {
    const res = await logoutSession(args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * GraphQL mutation resolver wrapping the authentication service's {@link services/authentication#deleteUser | deleteUser} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  deleteUser: async (_, args) => {
    const res = await deleteUser(args.id, args.username, args.deleteCookie);
    return GraphqlResult(res);
  },

  /**
   * GraphQL mutation resolver wrapping the content service's {@link services/content#createContent | createContent} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @param info - GraphQL query info object that contains the list of fields to be returned.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
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
   * GraphQL mutation resolver wrapping the content service's {@link services/content#updateContent | updateContent} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @param info - GraphQL query info object that contains the list of fields to be returned.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
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
   * GraphQL mutation resolver wrapping the content service's {@link services/content#deleteContent | deleteContent} function.
   * @param args - Argument object containing arguments to pass along to the service function.
   * @returns an object containing requested fields on a success, or a rejected promise on a failure.
   */
  deleteContent: async (_, args) => {
    const res = await deleteContent(args.id);
    return GraphqlResult(res);
  },
};
