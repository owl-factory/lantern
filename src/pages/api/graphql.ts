import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { NextApiRequest, NextApiResponse } from "next";
import { rulesetTypeDefs } from "graphql/typedefs/rulesets";
import { rulesetResolvers } from "graphql/resolvers/rulesets";
import { baseTypeDefs } from "graphql/typedefs/baseTypedefs";
import { userTypeDefs } from "graphql/typedefs/users";
import { campaignTypeDefs } from "graphql/typedefs/campaigns";
import { assetTypeDefs } from "graphql/typedefs/assets";
import { moduleTypeDefs } from "graphql/typedefs/modules";
import { moduleAccessTypeDefs } from "graphql/typedefs/moduleAccess";
import { contentTypeDefs } from "graphql/typedefs/contents";
import { contentTypeTypeDefs } from "graphql/typedefs/contentTypes";
import { actorTypeTypeDefs } from "graphql/typedefs/actorTypes";
import { actorSheetTypeDefs } from "graphql/typedefs/actorSheets";
import { actorTypeDefs } from "graphql/typedefs/actors";
import { campaignModuleTypeDefs } from "graphql/typedefs/campaignModules";
import { campaignAccessTypeDefs } from "graphql/typedefs/campaignAccess";
import { contentAccessTypeDefs } from "graphql/typedefs/contentAccess";
import { userResolvers } from "graphql/resolvers/users";
import { actorResolvers } from "graphql/resolvers/actors";
import { actorSheetResolvers } from "graphql/resolvers/actorSheets";
import { assetResolvers } from "graphql/resolvers/assets";
import { campaignResolvers } from "graphql/resolvers/campaigns";
import { campaignAccessResolvers } from "graphql/resolvers/campaignAccess";
import { campaignModuleResolvers } from "graphql/resolvers/campaignModules";
import { contentResolvers } from "graphql/resolvers/contents";
import { contentTypeResolvers } from "graphql/resolvers/contentTypes";
import { contentAccessResolvers } from "graphql/resolvers/contentAccess";
import { contentRelationResolvers } from "graphql/resolvers/contentRelations";
import { moduleResolvers } from "graphql/resolvers/modules";
import { moduleAccessResolvers } from "graphql/resolvers/moduleAccess";
import { contentRelationTypeDefs } from "graphql/typedefs/contentRelations";
import { actorTypeResolvers } from "graphql/resolvers/actorTypes";
global.fetch = require("cross-fetch");


const apolloServer = new ApolloServer({
  // schema,
  typeDefs: [
    baseTypeDefs,

    actorTypeDefs,
    actorSheetTypeDefs,
    actorTypeTypeDefs,

    assetTypeDefs,

    campaignTypeDefs,
    campaignAccessTypeDefs,
    campaignModuleTypeDefs,

    contentTypeDefs,
    contentAccessTypeDefs,
    contentRelationTypeDefs,
    contentTypeTypeDefs,

    moduleTypeDefs,
    moduleAccessTypeDefs,

    rulesetTypeDefs,

    userTypeDefs,
  ],
  resolvers: [
    actorResolvers,
    actorSheetResolvers,
    actorTypeResolvers,
    actorResolvers,

    assetResolvers,

    campaignResolvers,
    campaignAccessResolvers,
    campaignModuleResolvers,

    contentResolvers,
    contentAccessResolvers,
    contentRelationResolvers,
    contentTypeResolvers,

    moduleResolvers,
    moduleAccessResolvers,

    rulesetResolvers,

    userResolvers,
  ],
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  context: ({req, res}) => {
    return {
      session: null,
      req,
      res,
    };
  },
});

const server = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await server;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
