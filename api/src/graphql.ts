import "reflect-metadata";
import { parse } from "cookie";
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
    const cookies = parse(event.headers.cookie);
    return {
      headers: event.headers,
      functionName: context.functionName,
      cookies,
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