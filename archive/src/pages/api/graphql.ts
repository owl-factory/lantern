import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { buildApolloServer } from "api/apollo-server";
global.fetch = require("cross-fetch");


const apolloServer = buildApolloServer();

const server = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await server;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
