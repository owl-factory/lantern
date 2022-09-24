import { gql } from "apollo-server-micro";
import { GraphQLScalarType } from "graphql";
import { getPrismaClient } from "utilities/prisma";

export const typeDefs = gql`
  scalar Json

  type Ruleset {
    id: String
    name: String
    alias: String

    actorTypes: [ActorType]
  }

  input RulesetInput {
    name: String
    alias: String
  }

  type ActorType {
    id: String
    name: String

    rulesetID: String
    ruleset: Ruleset

    defaultActorSheetID: String
    defaultActorSheet: ActorSheet
  }

  type ActorSheet {
    id: String
    name: String
    rulesetID: String
    ruleset: Ruleset
    layout: String
    styling: String
  }

  input ActorSheetInput {
    name: String
    rulesetID: String
    layout: String
    styling: String
  }

  type Actor {
    id: String
    name: String
    
    rulesetID: String
    ruleset: Ruleset

    actorTypeID: String
    actorType: ActorType

    campaignID: String
    # campaign: Campaign

    isPublic: Boolean
    publicAccess: String

    fields: Json
    content: Json
  }

  input ActorInput {
    name: String
    # actorTypeID: String
    fields: Json
    content: Json
  }

  input ActorSheetInclude {
    ruleset: Boolean
  }

  type Query {
    rulesets: [Ruleset]
    ruleset(id: String!): Ruleset

    actorSheets(include: ActorSheetInclude): [ActorSheet]
    actorSheet(id: String!): ActorSheet

    actors: [Actor]
    actor(id: String!): Actor
  }

  type Mutation {
    createRuleset(ruleset: RulesetInput!): Ruleset

    createActorSheet(rulesetID: String!): ActorSheet
    mutateActorSheet(id: String!, actorSheet: ActorSheetInput!): ActorSheet

    createActor(rulesetID: String!, actorTypeID: String!): Actor
    mutateActor(id: String!, actor: ActorInput!): Actor
  }

`;

/**
 * Defines a JSON type in the GraphQL Schema. Objects can be submitted and automatically be converted to and from JSON
 */
export const jsonScalar = new GraphQLScalarType({
  name: "Json",
  description: "A JSON object",
  serialize(value: unknown) { return JSON.stringify(value); },
  parseValue(value: unknown) { return JSON.parse(value as string); },
});

const prisma = getPrismaClient();

export const resolvers = {
  Json: jsonScalar,
  Query: {
    rulesets: () => prisma.ruleset.findMany(),
    ruleset: (id: string) => prisma.ruleset.findFirst({ where: { id }}),
    // actorTypes: ()
    actorSheets: (_: any, {include}: any) => {
      return prisma.actorSheet.findMany({
        include: {
          ruleset: include?.ruleset || false,
        },
      });
    },
    actorSheet: (id: string) => prisma.actorSheet.findFirst({ where: { id }}),
    actors: () => prisma.actor.findMany(),
    actor: (id: string) => prisma.actor.findFirst({ where: { id }}),

  },
  Mutation: {
    createRuleset: async (_: any, { ruleset }: any) => prisma.ruleset.create({ data: ruleset }),
    createActorSheet: async (_: any, { rulesetID }: { rulesetID: string }) => {
      return prisma.actorSheet.create({
        data: {
          name: "Untitled Actor Sheet",
          ruleset: { connect: { id: rulesetID }},
          layout: "<Sheet><Layout></Layout></Sheet>",
          styling: "",
        },
      });
    },
    mutateActorSheet: async (_: any, { id , actorSheet}: any) => {
      return prisma.actorSheet.update({ data: actorSheet, where: { id }});
    },
    createActor: async (_: any, { rulesetID, actorTypeID }: any) => {
      const actorType = await prisma.actorType.findFirst({ where: { id: actorTypeID }});
      if (!actorType) { throw ""; }
      return prisma.actor.create({ data: {
        name: "Untitled Actor",
        ruleset: { connect: { id: rulesetID }},
        actorType: { connect: { id: actorTypeID }},
        actorSheet: { connect: { id: actorType.defaultActorSheetID as string }},
      }});
    },
    mutateActor: async (_: any, { id, actor }: any) => {
      return prisma.actor.update({ data: actor, where: { id }});
    },
  },
};
