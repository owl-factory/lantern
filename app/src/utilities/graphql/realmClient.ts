import { ApolloClient, createHttpLink, InMemoryCache, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import fetch from "cross-fetch";
import { getSession, refreshSession } from '../auth';

/** Terminating HTTP link, actually sends the request to the server */ 
const httpLink = createHttpLink({
  uri: "https://realm.mongodb.com/api/client/v2.0/app/reroll-vsvhk/graphql",
  fetch,
});

/** 
 * Sets Authorization header for all requests using the access
 * token from the session cookie.
 */
const authLink = setContext((_, { headers }) => {
  // get the authentication token from a cookie
  const token = getSession()?.accessToken;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }
});

/**
 * onError link that will attempt to get a fresh access token and retry
 * a failed request when an Unauthorized error is encountered
 */
const refreshLink = onError(({ networkError, operation, forward }) => {
  if (networkError?.message == "Response not successful: Received status code 401") {
    // Let's refresh token through async request
    // Apollo observables are needed to do async inside an onError link
    return new Observable(observer => {
      refreshSession().then(refreshResponse => {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            // Switch out old access token for new one
            Authorization: `Bearer ${refreshResponse.accessToken}`,
          }
        }));
      }).then(() => {
        const subscriber = {
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer)
        };
        // Retry last failed request
        forward(operation).subscribe(subscriber);
      }).catch(error => {
        // No refresh or client token available, we force user to login
        observer.error(error);
      });
    });
  }
});

/** Global Apollo client */
export const client = new ApolloClient({
  // Refresh link is first in the chain as you need to set up the error state
  link: authLink.concat(refreshLink).concat(httpLink),
  cache: new InMemoryCache(),
});
