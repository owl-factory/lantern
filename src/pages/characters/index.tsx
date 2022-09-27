import { Actor } from "@prisma/client";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { ActorList } from "components/pages/characters";
import React from "react";

interface CharactersPageProps {
  actors: Actor[]
}

/**
 * Renders a page for displaying all of a user's characters
 */
function CharactersPage(props: CharactersPageProps) {
  const [activeActor, $setActiveActor] = React.useState<string | null>(null);

  /**
   * Sets the current actor
   * @param actorID The actor to set as the current actor
   */
  function setActiveCharacter(actorID: string | null) {
    if (actorID === null || actorID === activeActor) {
      $setActiveActor(null);
      return;
    }
    $setActiveActor(actorID);
  }

  return (
    <Page >
      <div style={{ float: "left", width: "200px" }}>
        <ClientOnly><ActorList activeActor={activeActor} setActiveActor={setActiveCharacter}/></ClientOnly>
      </div>
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
