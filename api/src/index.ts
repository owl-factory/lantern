import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { connect } from "mongoose";
import { CharacterResolver } from "./resolvers/CharacterResolver";


const main = async () => {
  // Schema for GraphQL
  const schema = await buildSchema({
    resolvers: [
      CharacterResolver
    ],
    emitSchemaFile: true,
    validate: false,
  });

  // create mongoose connection
  const mongoose = await connect(
    process.env.MONGO_CONNECTION_STRING!, 
    {useNewUrlParser: true, useUnifiedTopology: true}
  );
  await mongoose.connection;

  // Sets up a graphql server at /graphql
  const server = new ApolloServer({schema});
  const app = express();
  server.applyMiddleware({app});
  app.listen({ port: 3000 }, () => {
    console.log(`🚀 Server ready and listening!`);
  })
};

main().catch((error)=>{
  console.log(error, 'error');
})