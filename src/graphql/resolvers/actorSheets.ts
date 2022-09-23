import { ActorSheet } from "@prisma/client";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include when pulled
interface ActorSheetInclude {
  ruleset: true;
}

// The where clause for *many actor sheet queries
interface ActorSheetWhere {
  id?: string;
  rulesetID?: string;
}

// The changeable inputs for mutations
interface ActorSheetInput {
  name?: string;
  layout?: string;
  styling?: string;
}

interface GetActorSheetsArguments {
  where: ActorSheetWhere;
  include: ActorSheetInclude;
}

interface GetActorSheetArguments {
  id: string;
  include: ActorSheetInclude;
}

interface CreateActorSheetArguments {
  rulesetID: string;
  include: ActorSheetInclude;
}

interface MutateActorSheetArguments {
  id: string;
  actorSheet: ActorSheetInput;
  include: ActorSheetInclude;
}

/**
 * Fetches many actor sheets
 * @param where The where clause for selecting documents
 * @param include Any additional documents to pull with the actor sheets
 * @returns A list of actor sheets
 */
async function getActorSheets(_: unknown, { where, include }: GetActorSheetsArguments) {
  return prisma.actorSheet.findMany({ where, include });
}

/**
 * Gets a single actor sheet
 * @param id The id of the actor sheet to fetch
 * @param include Any additional documents to pull
 * @returns An actor sheet
 */
async function getActorSheet(_: unknown, { id, include }: GetActorSheetArguments) {
  return prisma.actorSheet.findUnique({ where: { id }, include });
}

/**
 * Creates an actor sheet
 * @param rulesetID The ID of the ruleset
 * @param include Any additional documents to pull with the actor sheet
 * @returns The new actor sheet
 */
async function createActorSheet(_: unknown, { rulesetID, include }: CreateActorSheetArguments) {
  const ruleset = await prisma.ruleset.findUnique({ where: { id: rulesetID }});
  if (!ruleset) { throw "Error"; }

  return prisma.actorSheet.create({
    data: {
      name: "Untitled Actor Sheet",
      ruleset: { connect: { id: rulesetID }},
      layout: "<Sheet><Layout></Layout></Sheet>",
      styling: "",
    },
  });
}

/**
 * Mutates an actor sheet
 * @param id The ID of the actor sheet to mutate
 * @param actorSheet The changed values of the actor sheet
 * @returns The changed actor sheet
 */
async function mutateActorSheet(_: unknown, { id, actorSheet }: MutateActorSheetArguments) {
  return prisma.actorSheet.update({
    data: {
      ...actorSheet,
    },
    where: { id },
  });
}

export const actorSheetResolver = {
  Query: {
    actorSheets: getActorSheets,
    actorSheet: getActorSheet,
  },
  Mutation: {
    createActorSheet,
    mutateActorSheet,
  },
};
