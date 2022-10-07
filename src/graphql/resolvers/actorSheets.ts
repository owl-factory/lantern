import { getPrismaClient } from "utilities/prisma";
import sass from "sass";

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

interface ActorSheetCreateInput {
  name: string;
  rulesetID?: string;
}

// The changeable inputs for mutations
interface ActorSheetMutateInput {
  name?: string;
  layout?: string;
  rawStyling?: string;
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
  actorSheet: ActorSheetCreateInput;
  include: ActorSheetInclude;
}

interface MutateActorSheetArguments {
  id: string;
  actorSheet: ActorSheetMutateInput;
  include: ActorSheetInclude;
}

interface DeleteActorArguments {
  id: string;
  softDelete?: boolean;
}

/**
 * Fetches many actor sheets
 * @param where The where clause for selecting documents
 * @param include Any additional documents to pull with the actor sheets
 * @returns A list of actor sheets
 */
async function getActorSheets(_: unknown, { where, include }: GetActorSheetsArguments) {
  return prisma.actorSheet.findMany({ where: { ...where, deletedAt: null }, include });
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
async function createActorSheet(_: unknown, { actorSheet, include }: CreateActorSheetArguments) {
  const ruleset = await prisma.ruleset.findUnique({ where: { id: actorSheet.rulesetID }});
  if (!ruleset) { throw "Error"; }

  delete actorSheet.rulesetID;

  return prisma.actorSheet.create({
    data: {
      name: actorSheet.name,
      ruleset: { connect: { id: ruleset.id }},
      layout: "<Sheet><Layout></Layout></Sheet>",
      styling: "",
      rawStyling: "",
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
  const rawStyling = `.actor-sheet-${id} { ${actorSheet.rawStyling} }`;
  const compiled = sass.compileString(rawStyling);
  return prisma.actorSheet.update({
    data: {
      ...actorSheet,
      styling: compiled.css,
    },
    where: { id },
  });
}

/**
 * Allows for deleting an actor sheet
 * @param id The ID of the actor sheet to delete
 * @param softDelete Soft deletes the actor sheet by marking it as deleted
 * @returns A boolean marking the success
 */
 async function deleteActorSheet(_: unknown, { id, softDelete }: DeleteActorArguments) {
  const actorSheet = await prisma.actorSheet.findUnique({ where: { id } });
  if (!actorSheet) { return false; }
  if (softDelete) {
    await prisma.actorSheet.update({ data: { deletedAt: new Date() }, where: { id } });
    return true;
  }
  prisma.actorSheet.delete({ where: { id } });
  return true;
}

export const actorSheetResolvers = {
  Query: {
    actorSheets: getActorSheets,
    actorSheet: getActorSheet,
  },
  Mutation: {
    createActorSheet,
    mutateActorSheet,
    deleteActorSheet,
  },
};
