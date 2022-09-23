import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause of the *many queries
interface ModuleAccessWhere {
  moduleID?: string;
  userID?: string;
}

// Any extra documents to include in the response
interface ModuleAccessInclude {
  module: boolean;
  user: boolean;
}

interface GetModuleAccessArguments {
  where: ModuleAccessWhere;
  include: ModuleAccessInclude;
}

/**
 * Gets module access documents
 * @param where The where clause for the query
 * @param include Any additional documents to include in the response
 * @returns A list of module access documents
 */
async function getModuleAccess(_: unknown, { where, include }: GetModuleAccessArguments) {
  return prisma.moduleAccess.findMany({ where, include });
}

export const moduleAccessResolver = {
  Query: {
    moduleAccess: getModuleAccess,
  },
};
