/* eslint-disable no-restricted-syntax */
import type { MutationResolvers, Todo } from "generated/resolvers-types";
import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { database } from "lib/database";
import { NewTodo } from "types/database";
import { getQueryFields } from "utils/graphql";
import { emailRegex } from "utils/regex";

/**
 * Resolver map of all mutations resolvers.
 */
export const mutations: MutationResolvers = {
  login: async (_, args) => {
    const providerUserId = args.username.toLowerCase();
    // Set Lucia providerId based on whether the userId is an email or not.
    const providerId = emailRegex.test(providerUserId) ? "email" : "username";

    // key is null on authentication failure, on success it contains a userId of the correct identity.
    const key = await luciaAuth.useKey(providerId, providerUserId, args.password);

    if (key === null || key === undefined) {
      return "Username or password is incorrect";
    }

    await luciaAuth.deleteDeadUserSessions(key.userId);
    const session = await luciaAuth.createSession({
      userId: key.userId,
      attributes: {},
    });

    if (args.setCookie) {
      setSessionIdCookie(session.sessionId);
    }

    return session.sessionId;
  },

  logout: async (_, args) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return auth.error;
    }
    const session = auth.data;

    await luciaAuth.deleteDeadUserSessions(session.user.userId);
    await luciaAuth.invalidateSession(session.sessionId);
    if (args.deleteCookie) {
      deleteSessionIdCookie();
    }

    return session.sessionId;
  },

  createTodo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      throw auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
    }
    const queryFields = getQueryFields<"todo">(info);
    const newTodo = database
      .insertInto("todo")
      .values(args as NewTodo)
      .returning(queryFields)
      .executeTakeFirst();
    return newTodo as Promise<Todo>;
  },

  updateTodo: async (_, args, _context, info) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      throw auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
    }
    const queryFields = getQueryFields<"todo">(info);
    const updatedTodo = await database
      .updateTable("todo")
      .where("id", "=", args.id as string)
      .set(args as NewTodo)
      .returning(queryFields)
      .executeTakeFirst();

    return updatedTodo as Todo;
  },

  deleteTodo: async (_, args) => {
    const auth = await authenticateSession();
    if (auth.ok === false) {
      return auth.error; // Apollo server expects us to `throw` an error here, and that sucks!
    }
    const deleted = await database
      .deleteFrom("todo")
      .where("id", "=", args.id)
      .returning("id")
      .executeTakeFirst();
    if (deleted !== undefined) {
      return deleted.id;
    } else {
      throw `Item with ID '${args.id}' not found in database.`;
    }
  },
};
