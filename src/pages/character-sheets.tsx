import { gql } from "@apollo/client";
import { Box, Flex } from "@chakra-ui/react";
import { ActorSheet } from "@prisma/client";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { SheetList } from "components/pages/character-sheets";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { ActiveData } from "nodes/active-data";
import { Mediator } from "nodes/mediator";
import { ViewRender, ViewRenderer, ViewType } from "nodes/view-renderer";
import React from "react";
import { apolloClient } from "src/graphql/apollo-client";

const GET_ACTOR_SHEET = gql`
  query GetActorSheet($id: String!) {
    actorSheet(id: $id) {
      id,
      layout,
      styling,
      rulesetID,
    }
  }
`;

/**
 * Renders a page for creating, editing, and removing character sheet
 */
function CharacterSheetPage() {
  const [ activeSheet, $setActiveSheet ] = React.useState<string | undefined>(undefined);

  // Loads the mediator to render the actor sheet properly
  React.useEffect(() => {
    Mediator.set(ActorSheetMediatorHandler);
    return () => { Mediator.reset(); };
  }, []);

  /**
   * Sets the active sheet, or unsets one if already selected
   * @param sheetID The ID of the sheet to activate
   */
  function setActiveSheet(sheetID: string | undefined) {
    if (sheetID === undefined || sheetID === activeSheet) {
      $setActiveSheet(undefined);
      return;
    }
    $setActiveSheet(sheetID);
    // Ensure that everything is loaded in
    apolloClient.query<{actorSheet: ActorSheet}>({ query: GET_ACTOR_SHEET, variables: { id: sheetID }}).then((res) => {
      const actorSheet = res.data.actorSheet;
      if (!actorSheet) { return; }
      ViewRenderer.import(
        actorSheet.id,
        ViewType.ActorSheet,
        { xml: actorSheet.layout, css: actorSheet.styling }
      );
      ActiveData.refreshRuleset(actorSheet.rulesetID);
    });
  }

  return (
    <Page>
      <Flex>
        <Box width="250px" marginRight="10px">
          <ClientOnly><SheetList activeSheet={activeSheet} setActiveSheet={setActiveSheet}/></ClientOnly>
        </Box>
        <Box width="100%"><ViewRender viewID={activeSheet} sources={{ actorID: "" }}/></Box>
        <Box marginLeft="10px" width="250px">Right side</Box>
      </Flex>
    </Page>
  );
}

export default CharacterSheetPage;
