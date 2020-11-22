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
import { GraphQLSchema } from "graphql";

global.fetch = require("cross-fetch");

let connectionString:any = process.env.MONGO_CONNECTION_STRING;
if ("__MONGO_URI__" in global) { connectionString = global.__MONGO_URI__; }

if (connectionString === "") {
  throw Error("No Mongo Connection String supplied.");
}

connect(
  connectionString, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema = buildSchema({
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
  schema: schema as unknown as GraphQLSchema,
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
