/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import gql from "graphql-tag";
import React from "react"
import Page from "../../../components/design/Page";
import { client } from "../../../utilities/graphql/pokemon";

const GET_POKEMON_INFO = gql`
{
  pokemons(first: 9) {
    id
    number
    name,
    image,
    
  }
}`;

/**
 * A playground for Laura's development so we don't bump into each other <3
 */
function LauraPlayground({pokemon}: any) {
  const [ pokemonSecond, setPokemonSecond ] = React.useState([])

  client.query({query: GET_POKEMON_INFO})
  .then((results: any) => {
    setPokemonSecond(results.data.pokemons);
  });

  return (
    <Page>
      <p>
        Laura&apos;s Playground!
      </p>
      <p>
        Here&apos;s where Laura is going to be doing her testing. &lt;3
      </p>
      <p>
        {JSON.stringify(pokemon)}
      </p>
      <p>
        {JSON.stringify(pokemonSecond)}
      </p>
    </Page>
  );
}

LauraPlayground.getInitialProps = async () => {
  const { data } = await client.query({query: GET_POKEMON_INFO});
  
  return { pokemon: data.pokemons }
}

export function testJest(a: number, b: number) {
  return a + b;
}

export default LauraPlayground;
