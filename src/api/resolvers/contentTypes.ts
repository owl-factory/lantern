import { getPrismaClient } from "utilities/prisma";


const prisma = getPrismaClient();

// Additional documents that can be included when pulling a content type
interface ContentTypeInclude {
  ruleset: boolean;
}

// The where clause of any *many calls
interface ContentTypeWhere {
  id?: string;
  rulesetID?: string;
}

// The input for setting data
interface ContentTypeCreateInput {
  name: string;
  alias: string;
  icon: string;
  contentFields: any; // TODO - determine best type
  viewLayout: string;
  viewStyling: string;
  searchLayout: string;
  resultLayout: string;
  searchStyling: string;
}

interface ContentTypeMutateInput {
  name?: string;
  alias?: string;
  icon?: string;
  contentFields?: any; // TODO - determine best type
  viewLayout?: string;
  viewStyling?: string;
  searchLayout?: string;
  resultLayout?: string;
  searchStyling?: string;
}

interface GetContentTypesArguments {
  where: ContentTypeWhere;
  include: ContentTypeInclude;
}

interface GetContentTypeArguments {
  id: string;
  include: ContentTypeInclude;
}

interface CreateContentTypeArguments {
  rulesetID: string;
  contentType: ContentTypeCreateInput;
  include: ContentTypeInclude;
}

interface MutateContentTypeArguments {
  id: string;
  contentType: ContentTypeMutateInput;
  include: ContentTypeInclude;
}

/**
 * Fetches many content types
 * @param where The where clause of the search
 * @param include Any additional documents to include
 * @returns A list of content types
 */
async function getContentTypes(_: unknown, { where, include }: GetContentTypesArguments) {
  return prisma.contentType.findMany({
    where,
    include,
  });
}

/**
 * Gets a single content type
 * @param id The ID of the content type
 * @param include Additional documents to include
 * @returns A single content type
 */
async function getContentType(_: unknown, { id, include }: GetContentTypeArguments) {
  return prisma.contentType.findUnique({ where: { id }, include });
}

/**
 * Creates a single content type
 * @param contentType The content type to create
 * @param include Any additional documents to include
 * @returns The created content type
 */
async function createContentType(_: unknown, { rulesetID, contentType, include }: CreateContentTypeArguments) {
  const ruleset = await prisma.ruleset.findUnique({ where: { id: rulesetID }});
  if (!ruleset) { throw "Error!"; }

  return prisma.contentType.create({
    data: {
      ...contentType,
      ruleset: { connect: { id: ruleset.id }},
    },
    include,
  });
}

/**
 * Mutates a single content type
 * @param id The ID of the content to update
 * @param contentType The changes to the content type to make
 * @param include Any additional documents to include
 * @returns The mutated content type
 */
async function mutateContentType(_: unknown, { id, contentType, include }: MutateContentTypeArguments) {
  return prisma.contentType.update({
    data: {
      name: contentType.name,
      alias: contentType.alias,
      icon: contentType.icon,
      contentFields: contentType.contentFields as string,
      viewLayout: contentType.viewLayout,
      viewStyling: contentType.viewStyling,
      searchLayout: contentType.searchLayout,
      resultLayout: contentType.resultLayout,
      searchStyling: contentType.searchStyling,
    },
    where: { id },
    include,
  });
}

export const contentTypeResolvers = {
  Query: {
    contentTypes: getContentTypes,
    contentType: getContentType,
  },
  Mutation: {
    createContentType,
    mutateContentType,
  },
};
