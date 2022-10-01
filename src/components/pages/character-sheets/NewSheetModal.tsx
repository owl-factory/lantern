import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ActorSheet } from "@prisma/client";
import React from "react";
import { NewSheetForm } from "./NewSheetForm";

interface NewActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveSheet: (id: string | null) => void;
}

/**
 * Renders a modal containing a form to create a new character
 * @param isOpen True if the modal is open, false otherwise
 * @param onClose The function to close the modal
 * @param setActiveActor The function to set the current actor
 */
export function NewSheetModal(props: NewActorModalProps) {

  function onCompleted(sheet: ActorSheet) {
    props.setActiveSheet(sheet.id);
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>New Character Sheet</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <NewSheetForm onCompleted={onCompleted}/>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit" form="createNewCharacterSheetForm">Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
