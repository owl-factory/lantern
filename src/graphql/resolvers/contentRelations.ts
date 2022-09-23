import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface CreateContentRelationArguments {
  parentID: string;
  childID: string;
}

/**
 * Creates a content relation between a parent and a child content
 * @param parentID The parent content ID
 * @param childID The child content ID
 * @returns The created content relation
 */
async function createContentRelation(_: unknown, { parentID, childID }: CreateContentRelationArguments) {
  return prisma.contentRelation.create({
    data: {
      parentID,
      childID,
    },
  });
}


export const contentRelationResolvers = {
  Mutation: {
    createContentRelation,
  },
};
