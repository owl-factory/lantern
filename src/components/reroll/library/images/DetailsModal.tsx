import { ImageController } from "client/library";
import { Modal } from "components/design";
import { Button } from "components/style";
import React from "react";
import { Card } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import { ImageDocument } from "types/documents";

interface ImageDetailsModalProps {
  imageController: ImageController;
  imageID: string;
  handleClose: () => void;
}

/**
 * Renders a modal with the details of an image.
 * @param imageController The manager for the images and the state.
 * @param imageID The id of the image to fetch and render details for
 * @param handleClose Handles closing the modal
 */
export function ImageDetailsModal(
  { imageController, imageID, handleClose }: ImageDetailsModalProps
): JSX.Element | null {
  if (imageID === "") { return null; }
  const [ image, setImage ] = React.useState<ImageDocument>({});

  // The images that is guaranteed to be there
  const baseImage = imageController.images[imageID];
  imageController.fetchImage(imageID);


  // Ensures that this only runs when the imageID changes
  React.useEffect(() => {
    imageController.fetchImage(imageID)
    .then((fetchedImage) => {
      setImage(fetchedImage);
    });},
    [ imageID ]
  );

  function deleteImage() {
    imageController.deleteImage(imageID);
    handleClose();
  }

  return (
    <Modal open={image !== null} handleClose={handleClose}>
      <Card>
        <Card.Header>
          <b>{baseImage.name}</b>
          <a href="#" className="clickable" style={{float: "right"}} onClick={handleClose}><MdClose  /></a>
        </Card.Header>
        <Card.Body>
          <img style={{maxWidth: "100%"}} height="auto" src={baseImage.src}/><br/>
          <Button onClick={deleteImage}>Delete</Button>
        </Card.Body>
      </Card>
    </Modal>
  );
}