import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `/api/graphql`,
  credentials: "same-origin",

  
});

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem
})

export const apolloClient = new ApolloClient({
  // uri: `/api/graphql`,
  cache: new InMemoryCache(),
  link: httpLink,
  
  // credentials: "same-origin",
});

