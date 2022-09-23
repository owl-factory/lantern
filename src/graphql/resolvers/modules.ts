import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include with the module
interface ModuleInclude {
  ruleset: boolean;
}

// The where clause for any *many queries
interface ModuleWhere {
  id?: string;
  rulesetID?: string;
}

// Inputs for creating a module
interface ModuleCreateInput {
  name: string;
  alias: string | null;
  rulesetID?: string; // Required but will be deleted; hence the ?
  isOfficial?: boolean;
  isPublished?: boolean;
  publishAccess?: string;
}

interface ModuleMutateInput {
  name?: string;
  alias?: string | null;
  isOfficial?: boolean;
  isPublished?: boolean;
  publishAccess?: string;
}

interface GetModulesArguments {
  where: ModuleWhere;
  include: ModuleInclude;
}

interface GetModuleArguments {
  id: string;
  include: ModuleInclude;
}

interface CreateModuleArguments {
  module: ModuleCreateInput;
  include: ModuleInclude;
}

interface MutateModuleArguments {
  id: string;
  module: ModuleMutateInput;
  include: ModuleInclude;
}

/**
 * Gets many modules
 * @param include Any additional documents to include
 * @returns A list of modules
 */
async function getModules(_: unknown, { where, include }: GetModulesArguments) {
  return prisma.module.findMany({ where, include });
}

/**
 * Fetches a single module
 * @param id The id of the module to fetch
 * @param include Any additional documents to include
 * @returns A single module
 */
async function getModule(_: unknown, { id, include }: GetModuleArguments) {
  return prisma.module.findUnique({ where: { id }, include });
}

/**
 * Creates a single module
 * @param module The module to create
 * @param include Any additional documents to include
 * @returns The created module
 */
async function createModule(_: unknown, { module, include }: CreateModuleArguments) {
  const ruleset = await prisma.ruleset.findUnique({ where: { id: module.rulesetID }});
  if (!ruleset) { throw "Error"; }

  delete module.rulesetID;

  return prisma.module.create({
    data: {
      ...module as any,
      ruleset: { connect: { id: module.rulesetID }},
    },
    include,
  });
}

/**
 * Mutates a single module
 * @param id The ID of the module to mutate
 * @param module The fields of the module to change
 * @param include Any additional documents to include
 * @returns The mutated module
 */
async function mutateModule(_: unknown, { id, module, include }: MutateModuleArguments) {
  return prisma.module.update({
    data: {
      ...module,
    },
    where: { id },
    include,
  });
}

export const moduleResolvers = {
  Query: {
    modules: getModules,
    module: getModule,
  },
  Mutation: {
    createModule,
    mutateModule,
  },
};
