import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// Any additional documents to include in the response
type RulesetInclude = {
  actorTypes: boolean;
};

// The where clause of the *many queries
interface RulesetWhere {
  id?: string;
}

interface RulesetCreateInput {
  name: string;
  alias?: string;
  isOfficial?: boolean;
  isPublished?: boolean;
  actorFields?: any;
  rules?: any;
}

interface RulesetMutateInput {
  name?: string;
  alias?: string;
  isOfficial?: boolean;
  isPublished?: boolean;
  actorFields?: any;
  rules?: any;
}

interface GetRulesetsArguments {
  where: RulesetWhere;
  include: RulesetInclude;
}

interface GetRulesetArguments {
  id: string;
  include: RulesetInclude;
}

interface CreateRulesetArguments {
  ruleset: RulesetCreateInput;
  include: RulesetInclude;
}

interface MutateRulesetArguments {
  id: string;
  ruleset: RulesetMutateInput;
  include: RulesetInclude;
}

/**
 * Fetches many rulesets
 */
async function getRulesets(_: unknown, { where, include }: GetRulesetsArguments) {
  return prisma.ruleset.findMany({ where, include });
}

/**
 * Gets one ruleset
 * @param id The ID of the ruleset to fetch
 * @returns A ruleset
 */
async function getRuleset(_: unknown, { id, include }: GetRulesetArguments) {
  return prisma.ruleset.findUnique({
    where: { id },
    include,
  });
}

/**
 * Creates a single ruleset
 * @param ruleset The contents of the new ruleset
 * @returns The created ruleset
 */
async function createRuleset(_: unknown, { ruleset, include }: CreateRulesetArguments) {
  return prisma.ruleset.create({
    data: {
      ...ruleset,
    },
    include,
  });
}

/**
 * Mutates a single ruleset
 * @param id The ID of the ruleset to mutate
 * @param ruleset The changes to the ruleset
 * @returns The mutated ruleset
 */
async function mutateRuleset(_: unknown, { id, ruleset, include }: MutateRulesetArguments) {
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
    include,
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
