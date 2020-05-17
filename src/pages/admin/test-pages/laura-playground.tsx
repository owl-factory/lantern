import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react"
import Page from "../../../components/design/Page";
import { NewGameSystemForm } from "../game-system/new";

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
      <p>
        Laura&apos;s Playground!
      </p>
      <p>
        Here&apos;s where Laura is going to be doing her testing. &lt;3
      </p>
      <p>
        {testCharacters()}
      </p>
    </Page>
  );
}

export function testJest(a: number, b: number) {
  return a + b;
}

export default LauraPlayground;
