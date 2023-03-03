import { NotebookSource } from "@prisma/client";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface NotebookInclude {
  notes?: boolean;
  notebookTags?: boolean;
}

// The where caluse for any *many queries
interface NotebookWhere {
  name?: string;
  source?: NotebookSource;
}

interface NotebookCreateInput {
  name: string;
  source: NotebookSource;
}

// The inputs to use for creating and mutating the notebook
interface NotebookMutateInput {
  name?: string;
  source?: NotebookSource;
}

interface GetNotebooksArguments {
  where: NotebookWhere;
  include: NotebookInclude;
}

interface GetNotebookArguments {
  id: string;
  include: NotebookInclude;
}

interface CreateNotebookArguments {
  notebook: NotebookCreateInput;
  include: NotebookInclude;
}

interface MutateNotebookArguments {
  id: string;
  notebook: NotebookMutateInput;
  include: NotebookInclude;
}

interface DeleteNotebookArguments {
  id: string;
  softDelete?: boolean;
}

/**
 * Fetches a list of many notebooks
 * @param include Determines which documents should be joined and included when pulling
 * @returns An array of notebooks
 */
async function getNotebooks(_: unknown, { where, include }: GetNotebooksArguments, extra: any) {
  return prisma.notebook.findMany({
    where: { ...where, deletedAt: null },
    include,
  });
}

/**
 * Gets a single notebook
 * @param include Determines which documents should be joined and included when pulling
 * @returns An notebook, if any
 */
async function getNotebook(_: unknown, { id, include }: GetNotebookArguments) {
  return prisma.notebook.findUnique({ where: { id }, include });
}

/**
 * Creates a new notebook
 * @param rulesetID The ruleset of the new notebook
 * @param notebookTypeID The type of notebook that this is
 * @returns The created notebook
 */
async function createNotebook(_: unknown, { notebook }: CreateNotebookArguments) {
  const newNotebook = await prisma.notebook.create({
    data: {
     ...notebook,
    },
  });
  return newNotebook;
}

/**
 * Mutates an notebook
 * @param id The ID of the notebook to update
 * @param notebook The notebook fields being updated
 * @param include Which documents to include when the notebook is returned
 * @returns The updated notebook
 */
async function mutateNotebook(_: unknown, { id, notebook, include }: MutateNotebookArguments) {
  return prisma.notebook.update({
    data: {
      ...notebook,
    },
    include,
    where: { id },
  });
}

/**
 * Allows for deleting an notebook
 * @param id The ID of the notebook to delete
 * @param softDelete Soft deletes the notebook by marking it as deleted
 * @returns A boolean marking the success
 */
async function deleteNotebook(_: unknown, { id, softDelete }: DeleteNotebookArguments) {
  const notebook = await prisma.notebook.findUnique({ where: { id } });
  if (!notebook) { return false; }
  if (softDelete) {
    await prisma.notebook.update({ data: { deletedAt: new Date() }, where: { id } });
    return true;
  }
  prisma.notebook.delete({ where: { id } });
  return true;
}

export const notebookResolvers = {
  Query: {
    notebooks: getNotebooks,
    notebook: getNotebook,
  },
  Mutation: {
    createNotebook,
    mutateNotebook,
    deleteNotebook,
  },
};
