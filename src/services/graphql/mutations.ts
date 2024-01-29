/* eslint-disable no-restricted-syntax */
import type { MutationResolvers, Todo } from "generated/resolvers-types";
import { authenticateSession, deleteSessionIdCookie, setSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { database } from "lib/database";
import { NewTodo } from "types/database";
import { isBadPassword } from "utils/authentication";
import { getQueryFields } from "utils/graphql";
import { emailRegex } from "utils/regex";

/**
 * GraphQL resolver map of all mutation resolvers. Used for GraphQL request that needs to write data.
 * Joined with query resolvers to make the full resolver map.
 */
export const mutations: MutationResolvers = {
  /**
   * Takes user signup information, create a new user in the database and then optionally log them in immediately.
   * @param args - Sign up form fields.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns void or the `id` of a session for the newly created user.
   */
  signup: async (_, args) => {
    if (isBadPassword(args.password)) {
      throw "Password does not meet requirements. Password should be between 8 and 40 characters and not be a commonly used password.";
    }

    // Create user and login key (email)
    const user = await luciaAuth.createUser({
      userId: crypto.randomUUID(),
      key: {
        providerId: "email",
        providerUserId: args.email.toLowerCase(),
        password: args.password,
      },
      attributes: {
        email: args.email,
        username: args.username,
        displayName: args.displayName || undefined,
      },
    });

    // Create secondary login key (username)
    await luciaAuth.createKey({
      userId: user.userId,
      providerId: "username",
      providerUserId: args.username.toLowerCase(),
      password: args.password,
    });

    if (args.logIn) {
      // Create session for new user
      const session = await luciaAuth.createSession({
        userId: user.userId,
        attributes: {},
      });
      if (args.setCookie) {
        setSessionIdCookie(session.sessionId);
      }
      return session.sessionId;
    }
    return "Session not created for new user.";
  },

  /**
   * Authenticate a user with their credentials and create a session for them, which will always be returned by the resolver but may
   * also be save to a cookie if the `setCookie` argument is `true`.
   * @param args - Argument object containing `username: string` (username or email of the account to log in to), `password: string`,
   * and `setCookie: boolean` fields.
   * @returns ID of the session generated for a newly logged in user.
   */
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

  /**
   * Authenticate a user session and then log out (delete) that session. Will also try to delete the associated cookie if `deleteCookie` argument is `true`.
   * @param args - Argument object containing just `deleteCookie: boolean`.
   * @returns ID of the session that was just logged out.
   */
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

  /**
   * If user is authenticated, creates a new Todo item in the database.
   * @param args - Fields that make up a Todo database object, with some optional fields potentially not included.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns newly created Todo object filtered to requested fields.
   */
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

  /**
   * If user is authenticated, updates a Todo item in the database.
   * @param args - Fields that make up a Todo database object, with some optional fields potentially not included, but `id` is strictly required.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns updated Todo object filtered to requested fields.
   */
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

  /**
   * If user is authenticated, deletes a Todo item in the database.
   * @param args - Argument object containing only the `id` of the Todo to be deleted.
   * @param info - GraphQL query info object that contains the list of requested fields to be returned.
   * @returns `id` of the deleted Todo.
   */
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
