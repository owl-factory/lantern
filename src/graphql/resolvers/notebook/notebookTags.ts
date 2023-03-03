import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface NotebookTagInclude {
  notebook?: boolean
  sourceNote?: boolean
  referencedNotes?: boolean
}

// The where caluse for any *many queries
interface NotebookTagWhere {
  name?: string;
  notebookID?: string;
}

interface GetNotebookTagsArguments {
  where: NotebookTagWhere;
  include: NotebookTagInclude;
}

interface GetNotebookTagArguments {
  id: string;
  include: NotebookTagInclude;
}

/**
 * Fetches a list of many notebooktags
 * @param include Determines which documents should be joined and included when pulling
 * @returns An array of notebooktags
 */
async function getNotebookTags(_: unknown, { where, include }: GetNotebookTagsArguments, extra: any) {
  return prisma.notebookTag.findMany({
    where: { ...where },
    include,
  });
}

/**
 * Gets a single notebooktag
 * @param include Determines which documents should be joined and included when pulling
 * @returns An notebooktag, if any
 */
async function getNotebookTag(_: unknown, { id, include }: GetNotebookTagArguments) {
  return prisma.notebookTag.findUnique({ where: { id }, include });
}


export const notebooktagResolvers = {
  Query: {
    notebooktags: getNotebookTags,
    notebooktag: getNotebookTag,
  },
};
