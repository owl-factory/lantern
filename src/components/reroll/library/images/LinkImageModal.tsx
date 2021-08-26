import { ImageController } from "client/library";
import { Input, Tooltip } from "components/design";
import { Button } from "components/style";
import { Card, CardBody, CardHeader } from "components/style/card";
import { Modal } from "components/style/modals";
import { Formik, Form as FormikForm } from "formik";
import React from "react";

interface LinkImageModalProps {
  imageController: ImageController;
  modal: boolean;
  handleClose: () => void;
}

export function LinkImageModal({ imageController, handleClose, modal }: LinkImageModalProps) {
  function saveLinkedImage(values: any) {
    imageController.saveLinkedImage(values);
    handleClose();
  }

  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <CardHeader><h3>New Image</h3></CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </Modal>
  );
}
