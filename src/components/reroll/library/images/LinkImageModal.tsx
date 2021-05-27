import { ImageManager } from "client/library";
import { Input, Modal, Tooltip } from "components/design";
import { Button } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Card } from "react-bootstrap";

interface LinkImageModalProps {
  imageManager: ImageManager;
  modal: boolean;
  handleClose: () => void;
}

/**
 * Renders a modal and form to link an image
 * @param imageManager The image manager containing all of the image information
 * @param handleClose The function to close this modal
 * @param modal True if the modal should be open
 */
export function LinkImageModal({ imageManager, handleClose, modal }: LinkImageModalProps): JSX.Element {
  function saveLinkedImage(values: any) {
    imageManager.saveLinkedImage(values);
    handleClose();
  }

  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <Card.Header><h3>New Image</h3></Card.Header>
        <Card.Body>
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
                <Input name="src"/>
                <label>Name</label>
                <Input name="name"/>
                <label>Preview</label>
                <img style={{ width: "100%", height: "auto" }} src={formik.values.src}/><br/>

                <Button type="submit">Save</Button>
              </FormikForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Modal>
  );
}
