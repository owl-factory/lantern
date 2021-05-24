import React from "react";
import { Input, Modal, Page, Tooltip } from "components/design";
import { StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { Button, Col, Row } from "components/style";
import { Card } from "react-bootstrap";
import { Form as FormikForm, Formik } from "formik";
import { rest } from "utilities/request";
import { NextPageContext } from "next";
import { getClient } from "utilities/db";
import { query as q } from "faunadb";
import { ImageDocument } from "types/documents";
import { propTypes } from "react-bootstrap/esm/Image";
import { mapFauna } from "utilities/fauna";

function deleteImage(id: string) {
  const client = getClient();
  client.query(q.Delete(q.Ref(q.Collection("images"), id)));
}

function UploadImageModal({ handleClose, modal }: { handleClose: () => void, modal: boolean }) {
  async function saveLinkedImage(values: any) {
    rest.put(`/api/images/external`, values)
    .then((res) => {
      // Clear form
      // Close modal?
      handleClose();
    })
    .catch((err) => {
      // Print errors
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

function ImageDetailsModal({ image, handleClose }: { image: ImageDocument | null, handleClose: () => void }) {
  if (image === null) { return null; }
  const client = getClient();
  const [ additionalImage, setImage ] = React.useState<ImageDocument>({});
  client.query(q.Get(q.Ref(q.Collection(image.collection), image.id)))
  .then((res: object) => {
    setImage(mapFauna(res) as object);
  })
  ;
  return (
    <Modal open={image !== null} handleClose={handleClose}>
      <Card>
        <Card.Header>
          <b>{image.name}</b>
        </Card.Header>
        <Card.Body>
          {additionalImage.name}
          <img width="100%" height="auto" src={image.src}/>
          <Button onClick={() => deleteImage(image.id as string)}>Delete</Button>
        </Card.Body>
      </Card>
    </Modal>
  );
}

interface ImageThumbnailProps {
  image: ImageDocument;
  openModal: (image: ImageDocument | null) => void
}

function ImageThumbnail({ image, openModal }: ImageThumbnailProps) {
  return (
    <Col xs={12} sm={4} md={3}>
      <Card>
        <Card.Body onClick={() => openModal(image)}>
          {image.name} <br/>
          <img width="100%" height="auto" src={image.src}/>
        </Card.Body>
      </Card>
    </Col>
  );
}

function Images({ images }: { images: ImageDocument[] }) {
  const [ modal, setModal ] = React.useState(false);
  const [ imageDetailsModal, setImageDetailsModal ] = React.useState<ImageDocument | null>(null);
  const imageThumbnails: JSX.Element[] = [];
  function closeModal() { setModal(false); }
  function closeImageDetailsModal() { setImageDetailsModal(null); }

  images.forEach((image: ImageDocument) => {
    imageThumbnails.push(<ImageThumbnail key={image.id} image={image} openModal={setImageDetailsModal}/>);
  });

  return (
    <div style={{marginTop: "20px"}}>
      <div>
        <h2>Images</h2>
        <Button type="button" onClick={() => setModal(true)}>Upload</Button>
        <Row>
          {imageThumbnails}
        </Row>

      </div>
      <ImageDetailsModal image={imageDetailsModal} handleClose={closeImageDetailsModal}/>
      <UploadImageModal modal={modal} handleClose={closeModal}/>
    </div>
  );
}

/**
 * Renders the liubrary of all user data
 * @param success Boolean. True if the getInitialProps was successful
 * @param message Failure message, if any.
 * @param data Contains the 
 */
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
      <Images images={props.data.images}/>
    </Page>
  );
}

Library.getInitialProps = async (ctx: NextPageContext) => {
  const libraryData = rest.get(`/api/library`);
  return libraryData;
};
