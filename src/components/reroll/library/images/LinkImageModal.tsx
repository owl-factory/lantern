import { Button } from "components/style";
import { Card, CardBody, CardHeader } from "@owl-factory/components/card";
import { Input } from "@owl-factory/components/form";
import { Modal } from "@owl-factory/components/modal";
import { Tooltip } from "@owl-factory/components/tooltip";
import { Formik, Form as FormikForm } from "formik";
import React from "react";

interface LinkImageModalProps {
  modal: boolean;
  handleClose: () => void;
}

export function LinkImageModal({ handleClose, modal }: LinkImageModalProps) {
  function saveLinkedImage(values: any) {
    // TODO - have linked image
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
                <Input type="text" name="src"/>
                <label>Name</label>
                <Input type="text" name="name"/>
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
