import { useQuery } from "@apollo/react-hooks";
import { Typography } from "@material-ui/core";
import gql from "graphql-tag";
import * as React from "react";
import Page from "../components/Page";

const characterQuery = gql`
{
  characters {
    id,
    name
  }
}`;

/**
 * A playground for Laura's development so we don't bump into each other <3
 */
function LauraPlayground() {
  const { data, loading, error } = useQuery(characterQuery);

  function testCharacters() {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error...</div>;
    }
    return <div>{JSON.stringify(data.characters)}</div>;
  }

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Laura's Playground!
      </Typography>
      <Typography paragraph>
        Here's where Laura is going to be doing her testing. &lt;3
      </Typography>
      {testCharacters()}
    </Page>
  );
}

export default LauraPlayground;
