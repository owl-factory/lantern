
import { Button, Col, Row } from "components/style";
import React from "react";
import { Card } from "react-bootstrap";
import { ImageDocument } from "types/documents";
import { ImageManager } from "client/library";
import { ImageDetailsModal, UploadImageModal } from "components/reroll/library/images";

interface ImageThumbnailProps {
  image: ImageDocument;
  openModal: (imageID: string) => void
}

function ImageThumbnail({ image, openModal }: ImageThumbnailProps) {
  return (
    <Col xs={12} sm={4} md={3}>
      <Card>
        <Card.Body onClick={() => openModal(image.id as string)}>
          {image.name} <br/>
          <img width="100%" height="auto" src={image.src}/>
        </Card.Body>
      </Card>
    </Col>
  );
}

enum ListFormat {
  Thumbnails,
}

interface ImageListProps {
  imageManager: ImageManager;
  listFormat?: ListFormat;
}

/**
 * 
 * @param props 
 * @returns 
 */
export function ImageList(props: ImageListProps): JSX.Element {
  const [ modal, setModal ] = React.useState(false);
  const [ imageDetailsModal, setImageDetailsModal ] = React.useState("");
  const imageThumbnails: JSX.Element[] = [];

  function closeModal() { setModal(false); }
  function closeImageDetailsModal() { setImageDetailsModal(""); }

  props.imageManager.imageList.forEach((imageID: string) => {
    const image = props.imageManager.images[imageID];
    switch(props.listFormat) {
      case ListFormat.Thumbnails:
      case undefined:
        imageThumbnails.push(<ImageThumbnail key={image.id} image={image} openModal={setImageDetailsModal}/>);
        break;
    }
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
      <ImageDetailsModal
        imageManager={props.imageManager}
        imageID={imageDetailsModal}
        handleClose={closeImageDetailsModal}
      />
      <UploadImageModal modal={modal} handleClose={closeModal}/>
    </div>
  );
}
