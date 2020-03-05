import { useQuery } from "@apollo/react-hooks";
import { Typography } from "@material-ui/core"
import gql from "graphql-tag";
// import mongodb from "mongodb"
import * as React from "react"
import Page from "../components/Page";

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
  const { data, loading, error } = useQuery(GET_POKEMON_INFO);

  function pokemon() {
    // mongodb.
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error...</div>;
    }

    console.log(data);
  }

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Laura's Playground!
      </Typography>
      <Typography paragraph>
        Here's where Laura is going to be doing her testing. &lt;3
      </Typography>
      {pokemon()}
    </Page>
  );
}

export default LauraPlayground;
