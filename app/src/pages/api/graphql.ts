import "reflect-metadata";
import { CharacterResolver } from "../../server/resolvers/CharacterResolver";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { GameSystemResolver } from "../../server/resolvers/GameSystemResolver";
import { ModuleResolver } from "../../server/resolvers/ModuleResolver";
import { NextAuthChecker } from "../../server/utilities/auth";
import { ApolloServer } from "apollo-server-micro";
import { CommonContentTypeResolver } from "../../server/resolvers/CommonContentTypeResolver";
import { CommonEntityTypeResolver } from "../../server/resolvers/CommonEntityTypeResolver";
import { ContentResolver } from "../../server/resolvers/ContentResolver";
import { ContentTypeResolver } from "../../server/resolvers/ContentTypeResolver";

global.fetch = require("cross-fetch");

connect(
  process.env.MONGO_CONNECTION_STRING!, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema: any = buildSchema({
  resolvers: [
    CharacterResolver,
    CommonContentTypeResolver,
    CommonEntityTypeResolver,
    ContentResolver,
    ContentTypeResolver,
    GameSystemResolver,
    ModuleResolver,
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
