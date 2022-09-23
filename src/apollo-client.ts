import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `http://192.168.0.195:3000/api/graphql`,
  cache: new InMemoryCache(),
});

