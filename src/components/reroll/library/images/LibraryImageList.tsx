
import { Button, Col, Row } from "components/style";
import React from "react";
import { Card } from "react-bootstrap";
import { ImageDocument } from "types/documents";
import { ImageManager } from "client/library";
import { ImageDetailsModal, ImageList, ListFormat } from "components/reroll/library/images";
import { observer } from "mobx-react-lite";
import { LinkImageModal } from "./LinkImageModal";

interface ImageListProps {
  imageManager: ImageManager;
  listFormat?: ListFormat;
}

/**
 * 
 * @param props 
 * @returns 
 */
export const LibraryImageList = observer((props: ImageListProps): JSX.Element =>{
  const [ modal, setModal ] = React.useState(false);
  const [ imageDetailsModal, setImageDetailsModal ] = React.useState("");

  function closeModal() { setModal(false); }
  function closeImageDetailsModal() { setImageDetailsModal(""); }

  

  return (
    <div style={{marginTop: "20px"}}>
      <div>
        <h2>Images</h2>
        <Button type="button" onClick={() => setModal(true)}>Upload</Button>
        <ImageList
          imageManager={props.imageManager}
          onClick={(image: ImageDocument) => setImageDetailsModal(image.id as string)}
          listFormat={props.listFormat}
        />

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
