import { getCtx } from "@owl-factory/next";
import { authenticate } from "nodes/auth/jwt";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include
interface ActorInclude {
  ruleset?: boolean;
  actorSheet?: boolean;
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

interface DeleteActorArguments {
  id: string;
  softDelete?: boolean;
}

/**
 * Fetches a list of many actors
 * @param include Determines which documents should be joined and included when pulling
 * @returns An array of actors
 */
async function getActors(_: unknown, { where, include }: GetActorsArguments, extra: any) {
  console.log(getCtx().req.cookies)
  const user = authenticate();
  console.log(user);
  return prisma.actor.findMany({
    where: { ...where, deletedAt: null },
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

  // Ensures that the actor name is dependent on the actor.fields.name value
  delete actor.name;
  if (actor.fields && actor.fields.name) {
    actor.name = actor.fields.name;
  }

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

/**
 * Allows for deleting an actor
 * @param id The ID of the actor to delete
 * @param softDelete Soft deletes the actor by marking it as deleted
 * @returns A boolean marking the success
 */
async function deleteActor(_: unknown, { id, softDelete }: DeleteActorArguments) {
  const actor = await prisma.actor.findUnique({ where: { id } });
  if (!actor) { return false; }
  if (softDelete) {
    await prisma.actor.update({ data: { deletedAt: new Date() }, where: { id } });
    return true;
  }
  prisma.actor.delete({ where: { id } });
  return true;
}

export const actorResolvers = {
  Query: {
    actors: getActors,
    actor: getActor,
  },
  Mutation: {
    createActor,
    mutateActor,
    deleteActor,
  },
};
