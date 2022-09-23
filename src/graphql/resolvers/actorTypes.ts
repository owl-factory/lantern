import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause of *many queries
interface ActorTypeWhere {
  id?: string;
  rulesetID?: string;
  defaultActorSheetID?: string;
}

// Any additional documents to return with the response
interface ActorTypeInclude {
  ruleset: boolean;
  defaultActorSheet: boolean;
}

interface GetActorTypesArguments {
  where: ActorTypeWhere;
  include: ActorTypeInclude;
}

interface GetActorTypeArguments {
  id: string;
  include: ActorTypeInclude;
}

// The inputs for creating a new actor type
interface ActorTypeCreateInput {
  name: string;
  baseActorType: string;
  rulesetID?: string;
  defaultActorSheetID?: string;
}

interface CreateActorTypeArguments {
  actorType: ActorTypeCreateInput;
  include: ActorTypeInclude;
}

// The inputs for mutating an actor type
interface ActorTypeMutateInput {
  name: string;
  baseActorType: string;
  defaultActorSheetID?: string;
}

interface MutateActorTypeArguments {
  id: string;
  actorType: ActorTypeMutateInput;
  include: ActorTypeInclude;
}

/**
 * Fetches a list of actor types
 * @param where The where clause
 * @param include Any additional documents to fetch
 * @returns A lists of actor types
 */
async function getActorTypes(_: unknown, { where, include }: GetActorTypesArguments) {
  return prisma.actorType.findMany({ where, include });
}

/**
 * Fetches a single actor type by its id
 * @param id The ID of the actor type to fetch
 * @param include Any additional documents to fetch
 * @returns A single actor type
 */
async function getActorType(_: unknown, { id, include }: GetActorTypeArguments) {
  return prisma.actorType.findUnique({
    where: { id },
    include,
  });
}

/**
 * Creates an actor type
 * @param actorType The actor type to create
 * @param include Any additional documents to fetch
 * @returns The created actor type
 */
async function createActorType(_: unknown, { actorType, include }: CreateActorTypeArguments) {
  // TODO - validate ruleset and default actor sheet
  const ruleset = await prisma.ruleset.findUnique({ where: { id: actorType.rulesetID } });
  if (!ruleset) { throw "Error!"; }

  let defaultActorSheet;
  if (actorType.defaultActorSheetID) {
    defaultActorSheet = await prisma.actorSheet.findUnique({ where: { id: actorType.defaultActorSheetID} });
    if (!defaultActorSheet) { throw "Error!"; }
  }

  delete actorType.rulesetID;
  delete actorType.defaultActorSheetID;

  return prisma.actorType.create({
    data: {
      ...actorType as any,
    },
    include,
  });
}

/**
 * Mutates an actor type
 * @param id The id of the actor type to mutate
 * @param actorType The changes to make to the actor type
 * @param include Any additional documents to return
 * @returns The mutated actor type
 */
async function mutateActorType(_: unknown, { id, actorType, include }: MutateActorTypeArguments) {
  let defaultActorSheet;
  if (actorType.defaultActorSheetID) {
    defaultActorSheet = await prisma.actorSheet.findUnique({ where: { id: actorType.defaultActorSheetID} });
    if (!defaultActorSheet) { throw "Error!"; }
  }

  delete actorType.defaultActorSheetID;

  return prisma.actorType.update({
    data: {
      ...actorType as any,
      defaultActorSheet: defaultActorSheet ? { connect: { id: defaultActorSheet.id } } : undefined,
    },
    where: { id },
    include,
  });
}

export const actorTypeResolvers = {
  Query: {
    actorTypes: getActorTypes,
    actorType: getActorType,
  },
  Mutation: {
    createActorType,
    mutateActorType,
  },
};
