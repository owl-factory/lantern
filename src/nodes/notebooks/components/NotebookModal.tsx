import { gql } from "@apollo/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { Formik } from "formik";
import React from "react";

const INITIAL_VALUES = {
  name: "",
};

// Soft deletes an actor sheet
const CREATE_NOTEBOOK = gql`
  mutation CreateNotebook($notebook: NotebookCreateInput) {
    createNotebook(notebook: $notebook)
  }
`;

export function NotebookModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function onSubmit(values: { name: string }) {
    return;
  }

  return (
    <>
      <Button onClick={onOpen}>New Notebook</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Notebook</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
            <>
              <ModalBody>
                <Input type="text" name="name"/>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
                <Button type="submit">Create</Button>
              </ModalFooter>
            </>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}
