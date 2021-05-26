
import { Button, Col, Row } from "components/style";
import React from "react";
import { Card } from "react-bootstrap";
import { ImageDocument } from "types/documents";
import { ImageManager } from "client/library";
import { ImageDetailsModal } from "components/reroll/library/images";
import { observer } from "mobx-react-lite";
import { LinkImageModal } from "./LinkImageModal";

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
export const ImageList = observer((props: ImageListProps): JSX.Element =>{
  const [ modal, setModal ] = React.useState(false);
  const [ imageDetailsModal, setImageDetailsModal ] = React.useState("");
  const imageThumbnails: JSX.Element[] = [];

  function closeModal() { setModal(false); }
  function closeImageDetailsModal() { setImageDetailsModal(""); }

  props.imageManager.imageList.forEach((imageID: string) => {
    const image = props.imageManager.images[imageID];
    if (!image) { return; }
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
      <LinkImageModal imageManager={props.imageManager} modal={modal} handleClose={closeModal}/>
    </div>
  );
});
