import { Box, Flex } from "@chakra-ui/react";
import { Actor } from "@prisma/client";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { ActorList, ActorView } from "components/pages/characters";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { Mediator } from "nodes/mediator";
import React from "react";

/**
 * Renders a page for displaying all of a user's characters
 */
function CharactersPage() {
  const [activeActor, $setActiveActor] = React.useState<string | null>(null);

  React.useEffect(() => {
    Mediator.set(ActorSheetMediatorHandler);
    return () => { Mediator.reset(); };
  }, []);

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
      <Flex>
        <Box  width="250px" marginRight="10px">
          <ClientOnly><ActorList activeActor={activeActor} setActiveActor={setActiveCharacter}/></ClientOnly>
        </Box>
        <Box width="100%">
          <ClientOnly><ActorView activeActor={activeActor}/></ClientOnly>
        </Box>
        <Box marginLeft="10px"width="250px">Chat</Box>
      </Flex>
    </Page>
  );
}

export default CharactersPage;
