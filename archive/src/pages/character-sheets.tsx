import { Box, Flex } from "@chakra-ui/react";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { SheetList, SheetView } from "components/pages/character-sheets";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { Mediator } from "nodes/mediator";
import React from "react";


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
  }

  return (
    <Page>
      <Flex>
        <Box width="250px" marginRight="10px">
          <ClientOnly><SheetList activeSheet={activeSheet} setActiveSheet={setActiveSheet}/></ClientOnly>
        </Box>
        <Box width="100%"><SheetView sheetID={activeSheet}/></Box>
        <Box marginLeft="10px" width="250px">Right side</Box>
      </Flex>
    </Page>
  );
}

export default CharacterSheetPage;
