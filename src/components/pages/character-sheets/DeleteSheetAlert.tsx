import { gql, useMutation } from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { ActorSheet } from "@prisma/client";
import React, { RefObject } from "react";

interface DeleteActorAlertProps {
  isOpen: boolean;
  onClose: () => void;
  sheet?: ActorSheet;
  onDelete: (sheet: ActorSheet) => void;
}

// Soft deletes an actor sheet
const DELETE_SHEET = gql`
  mutation SoftDeleteActorSheet($id: String!) {
    deleteActorSheet(id: $id, softDelete: true)
  }
`;

/**
 * Renders an alert that prompts the user to confirm if they want to delete the actor
 * @param isOpen True if this alert should be open
 * @param onClose A function that closes the alert
 * @param sheet The actor to potentially delete
 * @param onDelete A function to be called when the actor was successfully deleted
 */
export function DeleteSheetAlert(props: DeleteActorAlertProps) {
  const [ deleteSheetMutation ] = useMutation(DELETE_SHEET);
  const cancelRef = React.useRef() as RefObject<HTMLButtonElement>;

  /**
   * Handles post-deletion functionality. Ensures that everything is closed and the user is alerted to the success
   * @param sheet The actor that was deleted
   */
  function onCompleted(sheet: ActorSheet) {
    props.onClose();
    props.onDelete(props.sheet as ActorSheet);
    AlertController.success(`${sheet?.name} was successfully deleted`);
  }

  /**
   * Handles the case where the actor fails to delete
   * @param sheet The actor that was not successfully deleted
   */
  function onError(sheet: ActorSheet) {
    props.onClose();
    AlertController.error(`${sheet?.name} couldn't be deleted`);
  }

  /**
   * Deletes an actor sheet by running the deleteActorSheet mutation
   */
  function deleteSheet() {
    if (!props.sheet) {
      props.onClose();
      return;
    }

    // Takes a snapshot of the current actor sheet
    const sheet = props.sheet;

    deleteSheetMutation({
      variables: { id: props.sheet.id },
      onCompleted: () => onCompleted(sheet),
      onError: () => onError(sheet),
      refetchQueries: ["GetMyCharacterSheets"],
    });
  }

  return (
    <AlertDialog
      isOpen={props.isOpen && props.sheet !== undefined}
      onClose={props.onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete {props.sheet?.name}</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete {props.sheet?.name}? This cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose}>
              Cancel
            </Button>
            <Button  onClick={deleteSheet}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
