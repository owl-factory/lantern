import "reflect-metadata";
import { CharacterResolver } from "./resolvers/CharacterResolver";
import { connect } from "mongoose";
// import { connect } from "mongodb";
import { buildSchema } from "type-graphql";

const { ApolloServer } = require('apollo-server-lambda');

// connect(
//   process.env.MONGO_CONNECTION_STRING!, 
//   {useNewUrlParser: true, useUnifiedTopology: true}
// );



// const schema = buildSchema({
//   resolvers: [
//     CharacterResolver
//   ],
//   emitSchemaFile: false,
//   validate: false,
// });
// console.log("Pre-server")

// const server = new ApolloServer({ schema });

// console.log("Pre-handler")

// exports.handler = server.createHandler();
// context.callbackWaitsForEmptyEventLoop = false;

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

// const server = new ApolloServer({ schema });

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

const apolloHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: false,
  },
});

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  return apolloHandler(event, context, callback);

  // callback(null, {
  //   statusCode: 200,
  //   body: "DB connected"
  // });
}