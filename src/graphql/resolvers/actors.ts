import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface ActorInclude {
  ruleset?: boolean;
  actorType?: boolean;
}

// The where caluse for any *many queries
interface ActorWhere {
  id?: string;
  rulesetID?: string;
}

interface ActorCreateInput {
  name: string;
  rulesetID: string;
  actorTypeID: string;
  isPublic?: boolean;
  publicAccess?: string;
}

// The inputs to use for creating and mutating the actor
interface ActorMutateInput {
  name?: string | null;
  actorTypeID?: string;
  actorSheetID?: string;
  isPublic?: boolean;
  publicAccess?: string;
  fields?: any;
  content?: any;
}

interface GetActorsArguments {
  where: ActorWhere;
  include: ActorInclude;
}

interface GetActorArguments {
  id: string;
  include: ActorInclude;
}

interface CreateActorArguments {
  actor: ActorCreateInput;
  include: ActorInclude;
}

interface MutateActorArguments {
  id: string;
  actor: ActorMutateInput;
  include: ActorInclude;
}

/**
 * Fetches a list of many actors
 * @param include Determines which documents should be joined and included when pulling
 * @returns An array of actors
 */
async function getActors(_: unknown, { where, include }: GetActorsArguments, extra: any) {
  return prisma.actor.findMany({
    where,
    include,
  });
}

/**
 * Gets a single actor
 * @param include Determines which documents should be joined and included when pulling
 * @returns An actor, if any
 */
async function getActor(_: unknown, { id, include }: GetActorArguments) {
  return prisma.actor.findUnique({ where: { id }, include });
}

/**
 * Creates a new actor
 * @param rulesetID The ruleset of the new actor
 * @param actorTypeID The type of actor that this is
 * @returns The created actor
 */
async function createActor(_: unknown, { actor }: CreateActorArguments) {
  console.log(actor)
  // Fetches the actor type to ensure it is valid
  const actorType = await prisma.actorType.findUnique({ where: { id: actor.actorTypeID }});
  if (!actorType) { return undefined; }

  const newActor = await prisma.actor.create({
    data: {
      name: "Untitled Actor",
      ruleset: { connect: { id: actor.rulesetID }},
      actorType: { connect: { id: actor.actorTypeID }},
      actorSheet: { connect: { id: actorType.defaultActorSheetID as string }},
    },
  });
  console.log(newActor);
  return newActor;
}

/**
 * Mutates an actor
 * @param id The ID of the actor to update
 * @param actor The actor fields being updated
 * @param include Which documents to include when the actor is returned
 * @returns The updated actor
 */
async function mutateActor(_: unknown, { id, actor, include }: MutateActorArguments) {
  // Fetches the actor type, if it is being changed
  let actorType;
  if (actor.actorTypeID) {
    actorType = await prisma.actorType.findUnique({ where: { id: actor.actorTypeID }});
    if (!actorType) { throw "Error"; }
  }

  let actorSheet;
  // Fetches the actor sheet, if it is being changed
  if (actor.actorSheetID) {
    actorSheet = await prisma.actorSheet.findUnique({ where: { id: actor.actorSheetID }});
    if (!actorSheet) { throw "Error"; }
  }

  // Removes these fields to prevent issues within the data spread
  delete actor.actorSheetID;
  delete actor.actorTypeID;

  return prisma.actor.update({
    data: {
      ...actor as any,

      actorType: (actorType ? { connect: { id: actorType.id }} : undefined),
      actorSheet: (actorSheet ? { connect: { id: actorSheet.id }} : undefined),
    },
    include,
    where: { id },
  });
}

export const actorResolvers = {
  Query: {
    actors: getActors,
    actor: getActor,
  },
  Mutation: {
    createActor,
    mutateActor,
  },
};
