import { gql, useQuery } from "@apollo/client";
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
import { FormikHelpers } from "formik";

import React from "react";
import { NewCharacterForm } from "./NewCharacterForm";

interface NewCharacterModalProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  setActiveActor: (id: string | null) => void;
}

const CREATE_ACTOR = gql`
  mutation CreateActor($rulesetID: String!, $actorTypeID: String!) {
    createActor(rulesetID: $rulesetID, actorTypeID: $actorTypeID) {
      id, name
    }
  }
`;



export function NewCharacterModal(props: NewCharacterModalProps) {

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
            <NewCharacterForm onCompleted={onCompleted}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button type="submit" form="createNewCharacterForm">Create</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
  )
}
