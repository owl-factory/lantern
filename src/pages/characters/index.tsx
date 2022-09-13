import { Actor } from "@prisma/client";
import { Page } from "components/design";
import React from "react";

interface CharactersPageProps {
  actors: Actor[]
}

/**
 * Renders a page for displaying all of a user's characters
 * @returns 
 */
function CharactersPage(props: CharactersPageProps) {
  // TODO - group the characters by rulesets

  const [ current, setCurrent ] = React.useState<string | undefined>(undefined);

  return (
    <Page >
      <div style={{ float: "left", width: "200px" }}>Characters</div>
      <div style={{ float: "right", width: "200px" }}>Chat</div>
      <h1>Select Character</h1>
      Character stuff
    </Page>
  );
}

export function getServerSideProps() {
  return {
    props: {
      actors: [], // Should load all basic character information
    },
  };
}

export default CharactersPage;
