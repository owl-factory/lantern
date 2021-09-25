import { ImageManager } from "client/data";
import { ImageController } from "client/library";
import { Button } from "components/style";
import { Card, CardBody, CardHeader } from "components/style/card";
import { Modal } from "components/style/modals";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdClose } from "react-icons/md";
import { ImageDocument } from "types/documents";

interface ImageDetailsModalProps {
  imageID: string;
  open: boolean
  handleClose: () => void;
}

/**
 * Renders a modal with the details of an image.
 * @param imageController The manager for the images and the state.
 * @param imageID The id of the image to fetch and render details for
 * @param handleClose Handles closing the modal
 */
function $ImageDetailsModal({ imageID, open, handleClose }: ImageDetailsModalProps): JSX.Element | null {
  const [ image, setImage ] = React.useState<ImageDocument>({ id: "" });

  // Ensures that this only runs when the imageID changes
  React.useEffect(() => {
    const newImage = ImageManager.get(imageID);
    if (!newImage) { return; }
    setImage(newImage);
  }, [ imageID, ImageManager.updatedAt ]);



  function deleteImage() {
    // ImageManager.deleteOne(imageID);
    handleClose();
  }

  return (
    <Modal open={open} handleClose={handleClose}>
      <Card>
        <CardHeader>
          <b>{image.name}</b>
          <a href="#" className="clickable" style={{float: "right"}} onClick={handleClose}><MdClose  /></a>
        </CardHeader>
        <CardBody>
          <img style={{maxWidth: "100%"}} height="auto" src={image.src}/><br/>
          <Button onClick={deleteImage}>Delete</Button>
        </CardBody>
      </Card>
    </Modal>
  );
}

export const ImageDetailsModal = observer($ImageDetailsModal);
