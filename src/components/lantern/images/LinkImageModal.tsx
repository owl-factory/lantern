import { Box, Modal, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { Formik, Form as FormikForm } from "formik";
import React from "react";

interface LinkImageModalProps {
  modal: boolean;
  handleClose: () => void;
}

/**
 * Renders a modal and form to link an image
 * @param handleClose The function to close this modal
 * @param modal True if the modal should be open
 */
export function LinkImageModal({ handleClose, modal }: LinkImageModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function saveLinkedImage(values: any) {
    // TODO - have linked image
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box>
        <Box><h3>New Image</h3></Box>
        <Box>
          <Formik
            initialValues={{ src: "", name: "" }}
            onSubmit={saveLinkedImage}
          >
            { (formik) => (
              <FormikForm>
                <h4>
                  Link Image
                  <Tooltip title="Save a reference to the image"><span>(?)</span></Tooltip>
                </h4>
                <label>Link</label>
                <Input type="text" name="src"/>
                <label>Name</label>
                <Input type="text" name="name"/>
                <label>Preview</label>
                <img style={{ width: "100%", height: "auto" }} src={formik.values.src}/><br/>

                <Button type="submit">Save</Button>
              </FormikForm>
            )}
          </Formik>
        </Box>
      </Box>
    </Modal>
  );
}
