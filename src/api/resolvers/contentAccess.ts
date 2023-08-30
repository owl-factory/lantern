import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause for *many queries
interface ContentAccessWhere {
  userID?: string;
  contentID?: string;
}

// Any additional documents to include with the response
interface ContentAccessInclude {
  user?: boolean;
  content?: boolean;
}

interface GetContentAccessesArguments {
  where: ContentAccessWhere;
  include: ContentAccessInclude;
}

// Describes the fields to create a new content access
interface ContentAccessCreateInput{
  contentID: string;
  userID: string;
  access: string;
}

// The fields to mutate and existing content access document
interface ContentAccessMutateInput {
  access: string;
}

interface CreateContentAccessArguments {
  contentAccess: ContentAccessCreateInput;
  include: ContentAccessInclude;
}

interface MutateContentAccessArguments {
  contentID: string;
  userID: string;
  contentAccess: ContentAccessMutateInput;
  include: ContentAccessInclude;
}

/**
 * Gets a list of content access documents
 * @param where The where clause of the query
 * @param include Any additional documents that should be included
 * @returns A list of content access documents+
 */
async function getContentAccesses(_: unknown, { where, include }: GetContentAccessesArguments) {
  return prisma.contentAccess.findMany({
    where,
    include,
  });
}

/**
 * Creates a new content access document
 * @param contentAccess The content access to create
 * @param include Any additional documents that should be included
 * @returns The created content access
 */
async function createContentAccess(_: unknown, { contentAccess, include }: CreateContentAccessArguments) {
  return prisma.contentAccess.create({
    data: {
      content: { connect: { id: contentAccess.contentID }},
      user: { connect: { id: contentAccess.userID }},
      access: contentAccess.access,
    },
    include,
  });
}

/**
 * Mutates a single content access document
 * @param contentID The content ID of the content access to change
 * @param userID The user ID of the content access to change
 * @param contentAccess The changes to the content access to make
 * @param include Any additional documents to return
 * @returns The mutated content access
 */
async function mutateContentAccess(
  _: unknown,
  { contentID, userID, contentAccess, include }: MutateContentAccessArguments
) {
  return prisma.contentAccess.update({
    data: { access: contentAccess.access },
    where: { contentID, userID },
    include,
  });
}

export const contentAccessResolvers = {
  Query: {
    contentAccess: getContentAccesses,
  },
  Mutation: {
    createContentAccess,
    mutateContentAccess,
  },
};
