import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { resolvers, typeDefs } from "src/graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { NextApiRequest, NextApiResponse } from "next";
import { rulesetTypeDefs } from "src/graphql/typedefs/rulesets";
import { rulesetResolvers } from "src/graphql/resolvers/rulesets";
import { baseTypeDefs } from "src/graphql/typedefs/baseTypedefs";
import { userTypeDefs } from "src/graphql/typedefs/users";
import { campaignTypeDefs } from "src/graphql/typedefs/campaigns";
import { assetTypeDefs } from "src/graphql/typedefs/assets";
import { moduleTypeDefs } from "src/graphql/typedefs/modules";
import { moduleAccessTypeDefs } from "src/graphql/typedefs/moduleAccess";
import { contentTypeDefs } from "src/graphql/typedefs/contents";
import { contentTypeTypeDefs } from "src/graphql/typedefs/contentTypes";
import { actorTypeTypeDefs } from "src/graphql/typedefs/actorTypes";
import { actorSheetTypeDefs } from "src/graphql/typedefs/actorSheets";
import { actorTypeDefs } from "src/graphql/typedefs/actors";
import { campaignModuleTypeDefs } from "src/graphql/typedefs/campaignModules";
import { campaignAccessTypeDefs } from "src/graphql/typedefs/campaignAccess";
import { contentAccessTypeDefs } from "src/graphql/typedefs/contentAccess";
import { userResolvers } from "src/graphql/resolvers/users";
import { actorResolvers } from "src/graphql/resolvers/actors";
import { actorSheetResolvers } from "src/graphql/resolvers/actorSheets";
import { assetResolvers } from "src/graphql/resolvers/assets";
import { campaignResolvers } from "src/graphql/resolvers/campaigns";
import { campaignAccessResolvers } from "src/graphql/resolvers/campaignAccess";
import { campaignModuleResolvers } from "src/graphql/resolvers/campaignModules";
import { contentResolvers } from "src/graphql/resolvers/contents";
import { contentTypeResolvers } from "src/graphql/resolvers/contentTypes";
import { contentAccessResolvers } from "src/graphql/resolvers/contentAccess";
import { contentRelationResolvers } from "src/graphql/resolvers/contentRelations";
import { moduleResolvers } from "src/graphql/resolvers/modules";
import { moduleAccessResolvers } from "src/graphql/resolvers/moduleAccess";
import { contentRelationTypeDefs } from "src/graphql/typedefs/contentRelations";
import { actorTypeResolvers } from "src/graphql/resolvers/actorTypes";
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
