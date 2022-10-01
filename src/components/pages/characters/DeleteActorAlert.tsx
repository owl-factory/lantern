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
import { Actor } from "@prisma/client";
import React, { RefObject } from "react";

interface DeleteActorAlertProps {
  isOpen: boolean;
  onClose: () => void;
  actor?: Actor;
  onDelete: (actor: Actor) => void;
}

// Soft deletes an actor
const DELETE_ACTOR = gql`
  mutation SoftDeleteActor($id: String!) {
    deleteActor(id: $id, softDelete: true)
  }
`;

/**
 * Renders an alert that prompts the user to confirm if they want to delete the actor
 * @param isOpen True if this alert should be open
 * @param onClose A function that closes the alert
 * @param actor The actor to potentially delete
 * @param onDelete A function to be called when the actor was successfully deleted
 */
export function DeleteActorAlert(props: DeleteActorAlertProps) {
  const [ deleteActorMutation ] = useMutation(DELETE_ACTOR);
  const cancelRef = React.useRef() as RefObject<HTMLButtonElement>;

  /**
   * Handles post-deletion functionality. Ensures that everything is closed and the user is alerted to the success
   * @param actor The actor that was deleted
   */
  function onCompleted(actor: Actor) {
    props.onClose();
    props.onDelete(props.actor as Actor);
    AlertController.success(`${actor?.name} was successfully deleted`);
  }

  /**
   * Handles the case where the actor fails to delete
   * @param actor The actor that was not successfully deleted
   */
  function onError(actor: Actor) {
    props.onClose();
    AlertController.error(`${actor?.name} couldn't be deleted`);
  }

  /**
   * Deletes an actor by running the deleteActor mutation
   */
  function deleteActor() {
    if (!props.actor) {
      props.onClose();
      return;
    }

    // Takes a snapshot of the current actor
    const actor = props.actor;

    deleteActorMutation({
      variables: { id: props.actor.id },
      onCompleted: () => onCompleted(actor),
      onError: () => onError(actor),
      refetchQueries: ["GetMyCharacters"],
    });
  }

  return (
    <AlertDialog
      isOpen={props.isOpen && props.actor !== undefined}
      onClose={props.onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete {props.actor?.name}</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete {props.actor?.name}? This cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose}>
              Cancel
            </Button>
            <Button  onClick={deleteActor}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
