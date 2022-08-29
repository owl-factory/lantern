import { Col, Row } from "@owl-factory/components/flex";
import { Card, CardBody, CardHeader } from "@owl-factory/components/card";
import { Input } from "@owl-factory/components/form";
import { Modal } from "@owl-factory/components/modal";
import { Tooltip } from "@owl-factory/components/tooltip";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button } from "@owl-factory/components/button";

interface UploadImageModalProps {
  modal: boolean;
  handleClose: () => void;
}

/**
 * Renders a function to upload an image to the CDN
 * @param handleClose The function to close the modal
 * @param modal True if this modal should be open
 */
export function UploadImageModal({ handleClose, modal }: UploadImageModalProps): JSX.Element {
  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <CardHeader><h3>New Image</h3></CardHeader>
        <CardBody>
          <Row>
            <Col xs={12} md={6}>
              <Formik
                initialValues={{ src: "", name: "" }}
                onSubmit={() => {return;}}
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
            </Col>
            <Col xs={12} md={6}>
              <h4>Upload Image</h4>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Modal>
  );
}
