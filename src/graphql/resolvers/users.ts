import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface UserWhere {
  id?: string;
  username?: string;
}

interface UserInclude {
  moduleAccess: boolean;
  contentAccess: boolean;
}

interface GetUsersArguments {
  where: UserWhere;
  include: UserInclude;
}

interface GetUserArguments {
  id?: string;
  username?: string;
  include: UserInclude;
}

/**
 * Fetches many users
 * @param where The where clause to search for users
 * @param include Additional fields to include
 * @returns A list of users
 */
async function getUsers(_: unknown, { where, include }: GetUsersArguments) {
  return prisma.user.findMany({
    where,
    include,
  });
}

/**
 * Finds a single user
 * @param id The id of the user to fetch
 * @param include Any additional documents to include
 * @returns A user document
 */
async function getUser(_: unknown, { id, include }: GetUserArguments) {
  return prisma.user.findUnique({
    where: { id },
    include,
  });
}

export const userResolvers = {
  Query: {
    users: getUsers,
    user: getUser,
  },
};
