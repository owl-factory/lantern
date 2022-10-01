import { Box, Flex } from "@chakra-ui/react";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { SheetList, SheetView } from "components/pages/character-sheets";
import React from "react";

/**
 * Renders a page for creating, editing, and removing character sheet
 */
function CharacterSheetPage() {
  const [ activeSheet, $setActiveSheet ] = React.useState<string | null>(null);

  function setActiveSheet(sheetID: string | null) {
    if (sheetID === null || sheetID === activeSheet) {
      $setActiveSheet(null);
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
        <Box width="100%"><SheetView activeSheet={activeSheet}/></Box>
        <Box marginLeft="10px" width="250px">Right side</Box>
      </Flex>
    </Page>
  );
}

export default CharacterSheetPage;
