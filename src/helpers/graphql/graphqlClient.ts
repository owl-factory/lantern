import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import ApolloClient, { OperationVariables, QueryOptions, MutationOptions } from "apollo-client";
import fetch from "cross-fetch";
import { def } from "../tools";

// This does not work correctly since sometimes its called from backend and othertimes from frontend
// Solution: api/env call?
const apiURL = def<string>(process.env.API_URL, "/api/graphql");

const httpOptions: HttpLink.Options = {
  uri: "https://stitch.mongodb.com/api/client/v2.0/app/reroll-vsvhk/graphql",
  fetch,
};

const cache = new InMemoryCache();
const link = new HttpLink(httpOptions);

export const client = new ApolloClient({
  cache,
  link,
});

client.link = new HttpLink(httpOptions);

export default class GraphqlClient {
  private url: string; // The target url
  private client!: ApolloClient<NormalizedCacheObject>;
  private httpOptions: HttpLink.Options = {}; // Dict containing all information for http requests
  private cache: InMemoryCache = new InMemoryCache();
  private link!: HttpLink;

  private headers: any = {};

  constructor (url: string, headerOptions?: any) {
    this.url = url;
    if (headerOptions !== undefined) {
      this.headers = headerOptions;
    }
    this.refreshClient();
  }

  /**
   * A wrapper around the ApolloClient mutate to utilize the same functionality
   * @param options Mutate options for the ApolloClient mutate function
   */
  public mutate(options: MutationOptions<OperationVariables>) {
    return this.client.mutate(options);
  }

  /**
   * A wrapper around the ApolloClient query to utilize the same functionality
   * @param options Query options for the ApolloClient query
   */
  public query(options: QueryOptions<OperationVariables>) {
    return this.client.query(options);
  }

  /**
   * Returns a copy of headers
   */
  public getHeaders() {
    return {...this.headers};
  }

  /**
   * Sets a single header value
   * 
   * @param key The key of the value to set
   * @param value The value to set
   * @param reload Optional. False if we do not want to reload the httpOptions
   */
  public setHeader(key: string, value: string, reload?: boolean) {
    this.headers[key] = value;

    if (reload !== false) {
      this.refreshClient();
    }
  }

  /**
   * 
   * @param key The key to remove
   * @param reload Optional. False to prevent refresh of the client afterwards
   */
  public removeHeader(key: string, reload?: boolean) {
    delete this.headers[key];

    if (reload !== false) {
      this.refreshClient();
    }
  }

  /**
   * Refreshes the client with any new httpOptions and headers
   */
  public refreshClient() {
    this.httpOptions = {
      uri: this.url,
      fetch,
      headers: this.headers,
    };

    this.link = new HttpLink(this.httpOptions);

    if (this.client === undefined) {
      this.client = new ApolloClient({
        cache: this.cache,
        link: this.link,
      });
      return;
    }

    this.client.link = this.link;
  }
}
