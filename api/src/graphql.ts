import "reflect-metadata";
import { CharacterResolver } from "./resolvers/CharacterResolver";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";

const { ApolloServer } = require('apollo-server-lambda');

connect(
  process.env.MONGO_CONNECTION_STRING!, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

const schema = buildSchema({
  resolvers: [
    CharacterResolver
  ],
  emitSchemaFile: false,
  validate: false,
});

const server = new ApolloServer({
  schema,
  context: ({ event, context }) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }
  },
});

const apolloHandler = server.createHandler();

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  return apolloHandler(event, context, callback);
}