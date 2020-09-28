import "reflect-metadata";
import { CharacterResolver } from "../../api/resolvers/CharacterResolver";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { GameSystemResolver } from "../../api/resolvers/GameSystemResolver";
import { ModuleResolver } from "../../api/resolvers/ModuleResolver";
import { NextAuthChecker } from "../../api/auth";
import { ApolloServer } from "apollo-server-micro";

connect(
  process.env.MONGO_CONNECTION_STRING!, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema: any = buildSchema({
  resolvers: [
    CharacterResolver,
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
