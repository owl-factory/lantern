import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause of any *many queries
interface ContentWhere {
  id?: string;
  rulesetID?: string;
  contentTypeID?: string;
}

// Any additional documents to include on return
interface ContentInclude {
  ruleset?: boolean;
  contentType?: boolean;
  module?: boolean;
  parentContent?: boolean;
  childrenContent?: boolean;
}

// Describes the fields that can be inserted into new content
interface CreateContentInput {
  name: string;
  alias?: string;
  rulesetID?: string;
  contentTypeID?: string;
  moduleID?: string;
  isPublic?: boolean;
}

// Describes the fields that can be mutated in existing content
interface MutateContentInput {
  name?: string;
  alias?: string | null;
  contentTypeID?: string;
  moduleID?: string | null;
  isPublic?: boolean;
  fields?: any;
}

interface GetContentsArguments {
  where: ContentWhere;
  include: ContentInclude;
}

interface GetContentArguments {
  id: string;
  include: ContentInclude;
}

interface CreateContentArguments {
  content: CreateContentInput;
  include: ContentInclude;
}

interface MutateContentArguments {
  id: string;
  content: MutateContentInput;
  include: ContentInclude;
}

/**
 * Fetches a list of contents
 * @param where The where clause of the content query
 * @param include Any additonal documents to include
 * @returns A list of contents
 */
async function getContents(_: unknown, { where, include }: GetContentsArguments) {
  return prisma.content.findMany({ where, include });
}

/**
 * Fetches a single content
 * @param id The ID of the content to fetch
 * @param include Any additional documents to include
 * @returns A single piece of content
 */
async function getContent(_: unknown, { id, include }: GetContentArguments) {
  return prisma.content.findUnique({ where: { id }, include });
}

/**
 * Creates a piece of content
 * @param content The content to create
 * @param include Any additional documents to create
 * @returns The created content
 */
async function createContent(_: unknown, { content, include }: CreateContentArguments) {
  const contentType = await prisma.contentType.findUnique({
    where: { id: content.contentTypeID },
    include: { ruleset: true },
  });
  if (!contentType || contentType.rulesetID !== content.rulesetID) { throw "Error!"; }

  let module;
  if (content.moduleID) {
    module = await prisma.module.findUnique({ where: { id: content.moduleID }});
    if (!module) { throw "Error!"; }
  }

  delete content.rulesetID;
  delete content.contentTypeID;
  delete content.moduleID;

  return prisma.content.create({
    data: {
      ...(content as any),
      ruleset: { connect: { id: contentType.rulesetID }},
      contentType: { connect: { id: contentType.id }},
      module: module ? { connect: { id: module.id }}: undefined,
    },
    include,
  });
}

/**
 * Mutates a piece of content
 * @param id The ID of the content to mutate
 * @param content The changes to the content
 * @param include Any additional documents to include
 * @returns The mutated content
 */
async function mutateContent(_: unknown, { id, content, include }: MutateContentArguments) {
  let contentType;
  if (content.contentTypeID) {
    contentType = await prisma.contentType.findUnique({ where: { id: content.contentTypeID }});
    if (!contentType) { throw "ERROR!"; }
  }

  const moduleID = content.moduleID;
  let module;
  if (content.moduleID) {
    module = await prisma.module.findUnique({ where: { id: content.moduleID }});
    if (!contentType) { throw "ERROR!"; }
  }

  delete content.contentTypeID;
  delete content.moduleID;

  return prisma.content.update({
    data: {
      ...content as any,
      module: module ? { connect: { id: module.id }} : undefined, // TODO - need a way to null
      contentType: contentType ? { connect: { id: contentType.id }} : undefined,
    },
    where: { id },
    include,
  });
}

export const contentResolvers = {
  Query: {
    contents: getContents,
    content: getContent,
  },
  Mutation: {
    createContent,
    mutateContent,
  },
};
