/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react"
import Page from "../../../components/design/Page";
import { client } from "../../../utilities/graphql";


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
  const { data, loading, error } = useQuery(GET_POKEMON_INFO);
  function getOtherPokemon() {
    if (loading) {
      return <>Loading...</>;
    }

    if (error) {
      return <>Error!</>;
    }

    return <>{JSON.stringify(data.pokemons)}</>;
  }
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
        {getOtherPokemon()}
      </p>
    </Page>
  );
}

LauraPlayground.getInitialProps = async () => {
  const { data, loading } = await client.query({query: GET_POKEMON_INFO});
  return { pokemon: data.pokemons }
}

// export default Page3;

export function testJest(a: number, b: number) {
  return a + b;
}

export default LauraPlayground;
