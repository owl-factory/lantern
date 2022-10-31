import { gql, useQuery } from "@apollo/client";
import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, ChakraProps, useDisclosure } from "@chakra-ui/react";
import { ActorSheet, Ruleset } from "@prisma/client";
import React from "react";
import { DeleteSheetAlert } from "./DeleteSheetAlert";
import { NewSheetModal } from "./NewSheetModal";

interface SheetListProps {
  activeSheet: string | undefined;
  setActiveSheet: (sheetID: string | undefined) => void;
}

interface SheetLineProps {
  sheet: ActorSheet & { ruleset: Ruleset };
  activeSheet: string | undefined;
  setActiveSheet: (sheetID: string | undefined) => void
  openDeleteAlert: (sheet: ActorSheet) => void;
}

// The query to get all of a player's characters
const GET_CHARACTER_SHEETS = gql`
  query GetMyCharacterSheets($include: ActorSheetInclude) {
    actorSheets(include: $include) {
      id,
      name,
      layout,
      styling,
      rawStyling,
      ruleset {
        id, name
      }
    }
  }
`;

/**
 * Renders a sheet line for the sheets list
 * @param sheet The sheet to render
 * @param activeSheet The currently active actor sheet
 * @param setActiveSheet A function to set the active sheet
 */
 function SheetLine(props: SheetLineProps) {
  const activeStyling: ChakraProps = props.sheet.id === props.activeSheet ? {
    backgroundColor: "lightblue",
  } : {};
  return (
    <>
      <Box
        padding="12.5px"
        marginTop="5px"
        marginBottom="5px"
        paddingLeft="10px"
        {...activeStyling}
        onClick={() => {props.setActiveSheet(props.sheet.id); return false;}}
      >
        {props.sheet.name}

        <Box float="right">
          <Button
            size="sm"
            top="-5px"
            onClick={(ev: any) => {ev.stopPropagation(); props.openDeleteAlert(props.sheet);}}
          >
            <DeleteIcon/>
          </Button>
        </Box>
      </Box>
      <hr/>
    </>
  );
}

/**
 * Renders a list of character sheets
 * @param activeSheet The currently active sheet
 * @param setActiveSheet A function to set the active sheet
 * @returns A list of actor sheets
 */
export function SheetList(props: SheetListProps) {
  const { data, loading, error, refetch } = useQuery(
    GET_CHARACTER_SHEETS,
    { variables: { include: { ruleset: true } } }
  );
  const modal = useDisclosure();
  const deleteAlert = useDisclosure();
  const [deleteSheet, setDeleteSheet] = React.useState<ActorSheet | undefined>(undefined);

  /**
   * Opens an alert to confirm the deletion of an actor sheet
   * @param sheet The actor shhet to potentially delete
   */
  function openDeleteAlert(sheet: ActorSheet) {
    setDeleteSheet(sheet);
    deleteAlert.onOpen();
  }

  /**
   * Closes the alert to confirm the deletion of an actor sheet
   */
  function closeDeleteAlert() {
    setDeleteSheet(undefined);
    deleteAlert.onClose();
  }

  /**
   * Handles any functionality required for an actor sheet that was just deleted
   * @param sheet The actor sheet that was just deleted
   */
  function onDelete(sheet: ActorSheet) {
    if (sheet.id === props.activeSheet) { props.setActiveSheet(undefined); }
  }

  const sheets: JSX.Element[] = [];
  if (loading) { return <>Loading</>; }
  if (error) { return <>Error! {error}</>; }

  for (const sheet of data.actorSheets) {
    sheets.push(
      <SheetLine
        key={sheet.id}
        sheet={sheet}
        activeSheet={props.activeSheet}
        setActiveSheet={props.setActiveSheet}
        openDeleteAlert={openDeleteAlert}
      />
    );
  }

  return (
    <>
      <Button onClick={modal.onOpen}>Add +</Button>
      <hr/>
      {sheets}
      <NewSheetModal isOpen={modal.isOpen} onClose={modal.onClose} setActiveSheet={props.setActiveSheet}/>
      <DeleteSheetAlert
        isOpen={deleteAlert.isOpen}
        onClose={closeDeleteAlert}
        sheet={deleteSheet}
        onDelete={onDelete}
      />
    </>
  );
}
