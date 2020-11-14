import "reflect-metadata";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { NextAuthChecker } from "../../server/utilities/auth";
import { ApolloServer } from "apollo-server-micro";
import {
  AssetResolver,
  CampaignResolver,
  CommonContentTypeResolver,
  CommonEntityTypeResolver,
  ContentResolver,
  ContentTypeResolver,
  EntityLayoutResolver,
  EntityResolver,
  EntityTypeResolver,
  GameSystemResolver,
  ModuleResolver,
  OrganizationResolver,
  RuleResolver,
  UserResolver
} from "../../server/resolvers";

global.fetch = require("cross-fetch");

connect(
  process.env.MONGO_CONNECTION_STRING!, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema: any = buildSchema({
  resolvers: [
    AssetResolver,
    CampaignResolver,
    CommonContentTypeResolver,
    CommonEntityTypeResolver,
    ContentResolver,
    ContentTypeResolver,
    EntityResolver,
    EntityLayoutResolver,
    EntityTypeResolver,
    GameSystemResolver,
    ModuleResolver,
    OrganizationResolver,
    RuleResolver,
    UserResolver,
  ],
  emitSchemaFile: false,
  validate: false,
  authChecker: NextAuthChecker,
});

const server = new ApolloServer({
  schema,
  context: ({req, res}) => {
    return {
      session: null,
      req,
      res
    }
  },
});

export default server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
}
