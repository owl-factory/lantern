import { Ruleset } from "@prisma/client";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

interface GetRulesetArguments {
  id: string;
}

interface CreateRulesetArguments {
  ruleset: Ruleset;
}

interface MutateRulesetArguments {
  id: string;
  ruleset: Ruleset;
}

/**
 * Fetches many rulesets
 */
async function getRulesets() {
  return prisma.ruleset.findMany();
}

/**
 * Gets one ruleset
 * @param id The ID of the ruleset to fetch
 * @returns A ruleset
 */
async function getRuleset(_: unknown, { id }: GetRulesetArguments) {
  return prisma.ruleset.findUnique({
    where: { id },
  });
}

/**
 * Creates a single ruleset
 * @param ruleset The contents of the new ruleset
 * @returns The created ruleset
 */
async function createRuleset(_: unknown, { ruleset }: CreateRulesetArguments) {
  return prisma.ruleset.create({
    data: {
      name: ruleset.name,
      alias: ruleset.alias,
      isOfficial: ruleset.isOfficial || false,
      isPublished: ruleset.isPublished || false,
      actorFields: ruleset.actorFields || {},
      rules: ruleset.rules || {},
    },
  });
}

/**
 * Mutates a single ruleset
 * @param id The ID of the ruleset to mutate
 * @param ruleset The changes to the ruleset
 * @returns The mutated ruleset
 */
async function mutateRuleset(_: unknown, { id, ruleset }: MutateRulesetArguments) {
  return prisma.ruleset.update({
    data: {
      name: ruleset.name,
      alias: ruleset.alias,
      isOfficial: ruleset.isOfficial || false,
      isPublished: ruleset.isPublished || false,
      actorFields: ruleset.actorFields || {},
      rules: ruleset.rules || {},
    },
    where: { id },
  });
}

export const rulesetResolvers = {
  Query: {
    rulesets: getRulesets,
    ruleset: getRuleset,
  },
  Mutation: {
    createRuleset,
    mutateRuleset,
  },
};
