
import { Button, Col, Row } from "components/style";
import React from "react";
import { Card } from "react-bootstrap";
import { ImageDocument } from "types/documents";
import { ImageManager } from "client/library";
import { ImageDetailsModal } from "components/reroll/library/images";
import { observer } from "mobx-react-lite";
import { LinkImageModal } from "./LinkImageModal";
import style from "./ImageList.module.scss";

interface ImageThumbnailProps {
  image: ImageDocument;
  openModal: (imageID: string) => void
}

function ImageIcon({ image, openModal }: ImageThumbnailProps) {
  return (
    <Col xs={12}>
      <div className={style.icon} onClick={() => openModal(image.id as string)}>
        <img style={{height: "auto", width: "auto"}} src={image.src}/>
        &nbsp;
        {image.name}
      </div>
      <hr/>
    </Col>
  );
}

function ImageThumbnail({ image, openModal }: ImageThumbnailProps) {
  return (
    <Col xs={6} sm={4} md={3} lg={2}>
      <Card onClick={() => openModal(image.id as string)}>
        <Card.Body >
          {image.name} <br/>
          <img style={{maxWidth: "100%"}} height="auto" src={image.src}/>
        </Card.Body>
      </Card>
    </Col>
  );
}

export enum ListFormat {
  Thumbnails,
  Icons,
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
      case ListFormat.Icons:
        imageThumbnails.push(<ImageIcon key={image.id} image={image} openModal={setImageDetailsModal}/>);
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
