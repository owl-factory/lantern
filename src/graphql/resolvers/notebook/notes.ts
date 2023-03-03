import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface NoteInclude {
  notebook?: boolean
  sourceTags?: boolean
  referencedTags?: boolean
}

// The where caluse for any *many queries
interface NoteWhere {
  name?: string;
  notebookID?: string;
}

interface NoteCreateInput {
  name: string;
  notebookID: string;
}

// The inputs to use for creating and mutating the note
interface NoteMutateInput {
  name?: string;
  content?: string;
}

interface GetNotesArguments {
  where: NoteWhere;
  include: NoteInclude;
}

interface GetNoteArguments {
  id: string;
  include: NoteInclude;
}

interface CreateNoteArguments {
  note: NoteCreateInput;
  include: NoteInclude;
}

interface MutateNoteArguments {
  id: string;
  note: NoteMutateInput;
  include: NoteInclude;
}

interface DeleteNoteArguments {
  id: string;
  softDelete?: boolean;
}

/**
 * Fetches a list of many notes
 * @param include Determines which documents should be joined and included when pulling
 * @returns An array of notes
 */
async function getNotes(_: unknown, { where, include }: GetNotesArguments, extra: any) {
  return prisma.note.findMany({
    where: { ...where },
    include,
  });
}

/**
 * Gets a single note
 * @param include Determines which documents should be joined and included when pulling
 * @returns An note, if any
 */
async function getNote(_: unknown, { id, include }: GetNoteArguments) {
  return prisma.note.findUnique({ where: { id }, include });
}

/**
 * Creates a new note
 * @param rulesetID The ruleset of the new note
 * @param noteTypeID The type of note that this is
 * @returns The created note
 */
async function createNote(_: unknown, { note }: CreateNoteArguments) {
  const newNote = await prisma.note.create({
    data: {
     name: note.name,
     content: "",
     notebook: { connect: { id: note.notebookID} },
    },
  });
  return newNote;
}

/**
 * Mutates an note
 * @param id The ID of the note to update
 * @param note The note fields being updated
 * @param include Which documents to include when the note is returned
 * @returns The updated note
 */
async function mutateNote(_: unknown, { id, note, include }: MutateNoteArguments) {
  return prisma.note.update({
    data: {
      ...note,
    },
    include,
    where: { id },
  });
}

/**
 * Allows for deleting an note
 * @param id The ID of the note to delete
 * @param softDelete Soft deletes the note by marking it as deleted
 * @returns A boolean marking the success
 */
async function deleteNote(_: unknown, { id }: DeleteNoteArguments) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) { return false; }
  prisma.note.delete({ where: { id } });
  return true;
}

export const noteResolvers = {
  Query: {
    notes: getNotes,
    note: getNote,
  },
  Mutation: {
    createNote,
    mutateNote,
    deleteNote,
  },
};
