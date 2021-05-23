import React from "react";
import { Input, Modal, Page, Tooltip } from "components/design";
import { StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { Button, Col, Row } from "components/style";
import { Card } from "react-bootstrap";
import { Form as FormikForm, Formik } from "formik";
import { rest } from "utilities/request";

function UploadImageModal({ handleClose, modal }: { handleClose: () => void, modal: boolean }) {
  async function saveLinkedImage(values: any) {
    console.log("test")
    rest.put(`/api/images/external`, values)
    .then((res) => {
      // Clear form
      // Close modal?
      handleClose();
    })
    .catch((err) => {
      // Print errors
      console.log(err);
    });
  }

  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <Card.Header><h3>New Image</h3></Card.Header>
        <Card.Body>
          <Row>
            <Col xs={12} md={6}>
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

function Images() {
  const [ modal, setModal ] = React.useState(false);

  function closeModal() { setModal(false); }

  return (
    <div style={{marginTop: "20px"}}>
      <div>
        <h2>Images</h2>
        <Button type="button" onClick={() => setModal(true)}>Upload</Button>
      </div>
      <UploadImageModal modal={modal} handleClose={closeModal}/>
    </div>
  );
}

export default function Library(props: any): JSX.Element {
  const maxAllowedStorage = 250 * 1024 * 1024;
  const usage = [
    { bytes: 15 * 1024 * 1024, storageType: StorageTypeEnum.Images },
    { bytes: 2500000, storageType: StorageTypeEnum.MusicTracks },
    { bytes: 10 * 1024 * 1024, storageType: StorageTypeEnum.AudioClips },
  ];
  return (
    <Page>
      <h1>Library</h1>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <Images />
    </Page>
  );
}
