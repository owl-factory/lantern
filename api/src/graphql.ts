import "reflect-metadata";
import { CharacterResolver } from "./resolvers/CharacterResolver";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import { GameSystemResolver } from "./resolvers/GameSystemResolver";

const { ApolloServer } = require('apollo-server-lambda');

connect(
  process.env.MONGO_CONNECTION_STRING!, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema = buildSchema({
  resolvers: [
    CharacterResolver,
    GameSystemResolver
  ],
  emitSchemaFile: false,
  validate: false,
});

const server = new ApolloServer({ schema });

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: false,
  },
});