import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react"
import Page from "../components/Page";
import { NewGameSystemForm } from "../pages/admin/game-system/new";

const GET_POKEMON_INFO = gql`
{
  pokemons(first: 150) {
    id
    number
    name,
    image,
    evolutions {
      id,
      number,
      name,
      image
    }
  }
}`;

/**
 * A playground for Laura's development so we don't bump into each other <3
 */
function LauraPlayground() {
  // const { data, loading, error } = useQuery(GET_POKEMON_INFO);

  function pokemon() {
    // if (loading) {
    //   return <div>Loading...</div>;
    // }

    // if (error) {
    //   return <div>Error...</div>;
    // }

    console.log("data");
  }

  return (
    <Page>
      Laura&apos;s Playground!
      Here&apos;s where Laura is going to be doing her testing. &lt;3
      {pokemon()}

      <NewGameSystemForm/>
    </Page>
  );
}

export default LauraPlayground;
