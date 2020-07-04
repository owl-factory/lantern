import GraphqlClient from "./graphqlClient";

/**
 * A test client for use with the publicly available graphql-pokemon endpoint.
 */
const pokemonClient = new GraphqlClient("https://graphql-pokemon.now.sh")
export default pokemonClient;