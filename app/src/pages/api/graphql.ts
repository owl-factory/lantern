import "reflect-metadata";
import { CharacterResolver } from "../../server/resolvers/Character";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { GameSystemResolver } from "../../server/resolvers/GameSystem";
import { ModuleResolver } from "../../server/resolvers/Module";
import { NextAuthChecker } from "../../server/utilities/auth";
import { ApolloServer } from "apollo-server-micro";
import { CommonContentTypeResolver } from "../../server/resolvers/CommonContentType";
import { CommonEntityTypeResolver } from "../../server/resolvers/CommonEntityType";
import { ContentResolver } from "../../server/resolvers/Content";
import { ContentTypeResolver } from "../../server/resolvers/ContentType";

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
    // ContentResolver,
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
