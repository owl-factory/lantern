  
import "reflect-metadata";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
// import { NextAuthChecker } from "../../server/utilities/auth";
import { ApolloServer } from "apollo-server-micro";
// import {
//   AssetResolver,
//   CampaignResolver,
//   CommonContentTypeResolver,
//   CommonEntityTypeResolver,
//   ContentResolver,
//   ContentTypeResolver,
//   EntityLayoutResolver,
//   EntityResolver,
//   EntityTypeResolver,
//   GameSystemResolver,
//   ModuleResolver,
//   OrganizationResolver,
//   RuleResolver,
//   UserResolver,
// } from "../../server/resolvers";
import { GraphQLSchema } from "graphql";
import { Query, Resolver } from "type-graphql";
import { RulesetDoc } from "types";
import { RulesetResolver } from "server";
// import { CharacterResolver } from "../../server/resolvers/Character";

global.fetch = require("cross-fetch");

const connectionString = process.env.MONGO_CONNECTION_STRING || "";

if (connectionString === "") {
  throw Error("No Mongo Connection String supplied.");
}

@Resolver()
export class TestResolver {
  @Query(() => RulesetDoc)
  public test() {
    return "testing!";
  }
}

connect(
  connectionString,
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema = buildSchema({
  resolvers: [
    RulesetResolver,
    TestResolver,
  ],
  emitSchemaFile: false,
  validate: false,
  // authChecker: NextAuthChecker,
});

const server = new ApolloServer({
  schema: schema as unknown as GraphQLSchema,
  context: ({req, res}) => {
    return {
      session: null,
      req,
      res,
    };
  },
});

export default server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};
