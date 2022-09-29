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
import { Actor } from "@prisma/client";

import React from "react";
import { NewActorForm } from "./NewActorForm";

interface NewActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveActor: (id: string | null) => void;
}

/**
 * Renders a modal containing a form to create a new character
 * @param isOpen True if the modal is open, false otherwise
 * @param onClose The function to close the modal
 * @param setActiveActor The function to set the current actor
 */
export function NewActorModal(props: NewActorModalProps) {

  function onCompleted(actor: Actor) {
    props.setActiveActor(actor.id);
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay/>
        <ModalContent>
          <ModalHeader>New Character</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <NewActorForm onCompleted={onCompleted}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button type="submit" form="createNewCharacterForm">Create</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
  )
}
