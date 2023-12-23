import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { actorSheetResolvers } from "./resolvers/actorSheets";
import { actorTypeResolvers } from "./resolvers/actorTypes";
import { actorResolvers } from "./resolvers/actors";
import { assetResolvers } from "./resolvers/assets";
import { campaignAccessResolvers } from "./resolvers/campaignAccess";
import { campaignModuleResolvers } from "./resolvers/campaignModules";
import { campaignResolvers } from "./resolvers/campaigns";
import { contentAccessResolvers } from "./resolvers/contentAccess";
import { contentRelationResolvers } from "./resolvers/contentRelations";
import { contentTypeResolvers } from "./resolvers/contentTypes";
import { contentResolvers } from "./resolvers/contents";
import { moduleAccessResolvers } from "./resolvers/moduleAccess";
import { moduleResolvers } from "./resolvers/modules";
import { rulesetResolvers } from "./resolvers/rulesets";
import { userResolvers } from "./resolvers/users";
import { actorSheetTypeDefs } from "./typedefs/actorSheets";
import { actorTypeTypeDefs } from "./typedefs/actorTypes";
import { actorTypeDefs } from "./typedefs/actors";
import { assetTypeDefs } from "./typedefs/assets";
import { baseTypeDefs } from "./typedefs/baseTypedefs";
import { campaignAccessTypeDefs } from "./typedefs/campaignAccess";
import { campaignModuleTypeDefs } from "./typedefs/campaignModules";
import { campaignTypeDefs } from "./typedefs/campaigns";
import { contentAccessTypeDefs } from "./typedefs/contentAccess";
import { contentRelationTypeDefs } from "./typedefs/contentRelations";
import { contentTypeTypeDefs } from "./typedefs/contentTypes";
import { contentTypeDefs } from "./typedefs/contents";
import { moduleAccessTypeDefs } from "./typedefs/moduleAccess";
import { moduleTypeDefs } from "./typedefs/modules";
import { rulesetTypeDefs } from "./typedefs/rulesets";
import { userTypeDefs } from "./typedefs/users";

export function buildApolloServer() {
  return new ApolloServer({
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
}
