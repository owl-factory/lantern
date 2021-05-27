import { Input, Modal, Tooltip } from "components/design";
import { Button, Col, Row } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Card } from "react-bootstrap";

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
        <Card.Header><h3>New Image</h3></Card.Header>
        <Card.Body>
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
                    <Input name="src"/>
                    <label>Name</label>
                    <Input name="name"/>
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
        </Card.Body>
      </Card>
    </Modal>
  );
}
